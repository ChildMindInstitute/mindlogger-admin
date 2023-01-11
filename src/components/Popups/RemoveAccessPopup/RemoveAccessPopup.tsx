import { useCallback, useEffect, useState } from 'react';
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
import { buttonTextByStep, getHeadCells } from './RemoveAccessPopup.const';
import { RemoveAccessPopupProps } from './RemoveAccessPopupProps.types';

export const RemoveAccessPopup = ({
  removeAccessPopupVisible,
  onClose,
  user,
}: RemoveAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email } = user;
  const applets = user.appletIds.map((id: string) => folders.useApplet(id));
  const [buttonText, setButtonText] = useState('removeAccess');
  const [step, setStep] = useState<keyof typeof screenByStep>(1);
  const [selectedApplets, setSelectedApplets] = useState<string[]>([]);
  const { control, getValues } = useForm({});

  const getAppletName = useCallback(
    (id: string) => applets.find((applet) => applet.id === id)?.name || '',
    [applets],
  );

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
      content: () => (
        <CheckboxController control={control} name={applet.id} label={<></>} defaultValue={''} />
      ),
      value: applet.id,
      width: '200',
    },
  }));

  const { execute } = useAsync(revokeAppletUserApi);

  const onSubmit = () => {
    if (step === 1) {
      const appletsIds = Object.entries(getValues())
        .filter((entry) => entry[1])
        .map(([key]) => key);
      setSelectedApplets(appletsIds);
    } else if (step === 2) {
      selectedApplets.forEach(async (appletId: string) => {
        await execute({ appletId, profileId: user['_id'], deleteResponse: false });
      });
    } else if (step === 3) {
      onClose();

      return;
    }

    setStep((prevState) => ++prevState as keyof typeof screenByStep);
  };

  useEffect(() => setButtonText(buttonTextByStep[step]), [step]);

  const listOfSelectedApplets = (
    <>
      {selectedApplets.map((id) => (
        <StyledTitleBoldMedium key={id}>- {getAppletName(id)} </StyledTitleBoldMedium>
      ))}
    </>
  );

  const screenByStep = {
    1: (
      <form noValidate>
        <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
          <b>
            {firstName} {lastName} ({email})
          </b>
          {t('userHasAccess')}
        </StyledBodyLarge>
        <Table columns={getHeadCells(t)} rows={rows} orderBy="name" uiType={UiType.secondary} />
      </form>
    ),
    2:
      selectedApplets.length === 1 ? (
        (() => {
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
        })()
      ) : (
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
      ),
    3:
      selectedApplets.length === 1 ? (
        (() => {
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
        })()
      ) : (
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
      ),
  };

  return (
    <Modal
      open={removeAccessPopupVisible}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('removeAccess')}
      width="52.4"
      hasSecondBtn={step === 2}
      secondBtnText={t('back')}
      onSecondBtnSubmit={() => setStep((prevState) => --prevState as keyof typeof screenByStep)}
      buttonText={t(buttonText)}
    >
      <StyledModalWrapper>{screenByStep[step]}</StyledModalWrapper>
    </Modal>
  );
};
