import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { FolderApplet, folders } from 'redux/modules';
import { CheckboxController } from 'components/FormComponents';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import {
  StyledBodyLarge,
  StyledLabelLarge,
  StyledTitleBoldMedium,
} from 'styles/styledComponents/Typography';
import { Table, UiType } from 'components/Tables';
import { useAsync } from 'hooks';
import { revokeAppletUserApi } from 'api';
import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
} from 'styles/styledComponents/AppletImage';

import { Modal } from '../Modal';
import { buttonTextByStep, headCells } from './RemoveAccessPopup.const';
import { RemoveAccessPopupProps, Steps } from './RemoveAccessPopupProps.types';

export const RemoveAccessPopup = ({
  removeAccessPopupVisible,
  onClose,
  user,
}: RemoveAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email } = user;
  const applets = user.appletIds.map((id: string) => folders.useApplet(id));
  const [buttonText, setButtonText] = useState('removeAccess');
  const [step, setStep] = useState<Steps>(0);
  const [selectedApplets, setSelectedApplets] = useState<string[]>([]);
  const defaultValues = applets.reduce((values, { id }) => ({ ...values, [id]: false }), {}) as {
    [key: string]: boolean;
  };
  const { control, getValues } = useForm({ defaultValues });

  const getAppletName = (id: string) => applets.find((applet) => applet.id === id)?.name || '';

  const rows = applets?.map((applet: FolderApplet) => ({
    name: {
      content: () => (
        <StyledFlexTopCenter>
          {applet.image ? (
            <StyledSmallAppletImg src={applet.image} alt="Applet image" />
          ) : (
            <StyledSmallAppletImgPlaceholder />
          )}
          <StyledLabelLarge>{applet.name}</StyledLabelLarge>
        </StyledFlexTopCenter>
      ),
      value: applet.name || '',
    },
    actions: {
      content: () => <CheckboxController control={control} name={applet.id} label={<></>} />,
      value: applet.id,
      width: '200',
    },
  }));

  const { execute } = useAsync(revokeAppletUserApi);

  const onSubmit = () => {
    if (step === 0) {
      const appletsIds = Object.entries(getValues()).reduce(
        (values, ids) => [...values, ...(ids[1] ? [ids[0]] : [])] as string[],
        [] as string[],
      );
      setSelectedApplets(appletsIds);
    } else if (step === 1) {
      selectedApplets.forEach(async (appletId: string) => {
        await execute({ appletId, profileId: user['_id'], deleteResponse: false });
      });
    } else if (step === 2) {
      onClose();

      return;
    }

    setStep((prevState) => ++prevState as Steps);
  };

  useEffect(() => setButtonText(buttonTextByStep[step]), [step]);

  const listOfSelectedApplets = (
    <>
      {selectedApplets.map((id) => (
        <StyledTitleBoldMedium key={id}>- {getAppletName(id)} </StyledTitleBoldMedium>
      ))}
    </>
  );

  const getFirstScreen = () => (
    <form noValidate>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <b>
          {firstName} {lastName} ({email})
        </b>
        {t('userHasAccess')}
      </StyledBodyLarge>
      <Table columns={headCells} rows={rows} orderBy="name" uiType={UiType.secondary} />
    </form>
  );

  const getSecondScreen = () => {
    const appletName = getAppletName(selectedApplets[0]);

    return (
      <StyledBodyLarge>
        <Trans i18nKey="confirmRemoveAccess">
          Are you sure that you want to remove the access for the
          <b>
            <>
              {{ firstName }} {{ lastName }}
            </>
          </b>{' '}
          the
          <b>
            <>{{ appletName }}</>
          </b>
          ?
        </Trans>
      </StyledBodyLarge>
    );
  };

  const getSecondMultipleScreen = () => (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="confirmMultipleRemoveAccess">
          Are you sure that you want to remove the access for the
          <b>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </b>
          to the list of Applets below?
        </Trans>
      </StyledBodyLarge>
      {listOfSelectedApplets}
    </>
  );

  const getThirdScreen = () => {
    const appletName = getAppletName(selectedApplets[0]);

    return (
      <StyledBodyLarge>
        <Trans i18nKey="removeAccessSuccess">
          Access for{' '}
          <b>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </b>
          to the{' '}
          <b>
            <>{{ appletName }}</>
          </b>{' '}
          has been removed successfully.
        </Trans>
      </StyledBodyLarge>
    );
  };

  const getThirdMultipleScreen = () => (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="multipleRemoveAccessSuccess">
          Access for{' '}
          <b>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </b>
          to the list of Applets below has been removed successfully.
        </Trans>
      </StyledBodyLarge>
      {listOfSelectedApplets}
    </>
  );

  const screenByStep = [
    getFirstScreen(),
    selectedApplets.length === 1 ? getSecondScreen() : getSecondMultipleScreen(),
    selectedApplets.length === 1 ? getThirdScreen() : getThirdMultipleScreen(),
  ];

  return (
    <Modal
      open={removeAccessPopupVisible}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('removeAccess')}
      width="52.4"
      hasSecondBtn={step === 1}
      secondBtnText={t('back')}
      onSecondBtnSubmit={() => setStep((prevState) => --prevState as Steps)}
      buttonText={t(buttonText)}
    >
      <StyledModalWrapper>{screenByStep[step]}</StyledModalWrapper>
    </Modal>
  );
};
