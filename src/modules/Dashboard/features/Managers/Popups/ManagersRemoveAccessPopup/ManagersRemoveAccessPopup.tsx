import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { FolderApplet } from 'redux/modules';
import { CheckboxController } from 'shared/components/FormComponents';
import {
  StyledModalWrapper,
  StyledBodyLarge,
  StyledLabelLarge,
  StyledTitleBoldMedium,
  StyledFlexTopCenter,
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
} from 'shared/styles/styledComponents';
import { Table, UiType, Modal } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { removeManagerAccess } from 'api';
import theme from 'shared/styles/theme';

import { buttonTextByStep, getHeadCells } from './ManagersRemoveAccessPopup.const';
import { RemoveAccessPopupProps, Steps } from './ManagersRemoveAccessPopupProps.types';

export const ManagersRemoveAccessPopup = ({
  removeAccessPopupVisible,
  onClose,
  user,
}: RemoveAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email } = user;
  const applets = [
    { name: 'testAppletName', id: 'testId' },
    { name: 'testAppletName2', id: 'testId2' },
  ] as FolderApplet[];
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

  const { execute } = useAsync(removeManagerAccess);

  const onSubmit = () => {
    switch (step) {
      case 0:
        setSelectedApplets(
          Object.entries(getValues()).reduce(
            (values, ids) => [...values, ...(ids[1] ? [ids[0]] : [])] as string[],
            [] as string[],
          ),
        );
        break;
      case 1:
        execute({ appletIds: selectedApplets, userId: user.id, role: 'admin' }); // TODO: remove 'admin' when requirements will be ready
        break;
      case 2:
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
        <strong>
          {firstName} {lastName} ({email})
        </strong>
        {t('userHasAccess')}
      </StyledBodyLarge>
      <Table columns={getHeadCells()} rows={rows} orderBy="name" uiType={UiType.Secondary} />
    </form>
  );

  const getSecondScreen = () => {
    const appletName = getAppletName(selectedApplets[0]);

    return (
      <StyledBodyLarge>
        <Trans i18nKey="confirmRemoveAccess">
          Are you sure that you want to remove the access for the
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          the
          <strong>
            <>{{ appletName }}</>
          </strong>
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
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
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
          Access for
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the
          <strong>
            <>{{ appletName }}</>
          </strong>
          has been removed successfully.
        </Trans>
      </StyledBodyLarge>
    );
  };

  const getThirdMultipleScreen = () => (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="multipleRemoveAccessSuccess">
          Access for
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the list of Applets below has been removed successfully.
        </Trans>
      </StyledBodyLarge>
      {listOfSelectedApplets}
      {!applets.length && (
        <StyledBodyLarge sx={{ marginTop: theme.spacing(2.4) }}>
          <Trans i18nKey="userHasNoAccessToAnyApplets">
            <strong>
              <>
                {{ firstName }} {{ lastName }} ({{ email }})
              </>
            </strong>{' '}
            no longer has access to any Applets.
          </Trans>
        </StyledBodyLarge>
      )}
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
      hasSecondBtn={step === 1}
      secondBtnText={t('back')}
      onSecondBtnSubmit={() => setStep((prevState) => --prevState as Steps)}
      buttonText={t(buttonText)}
    >
      <StyledModalWrapper>{screenByStep[step]}</StyledModalWrapper>
    </Modal>
  );
};
