import { RefObject, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Modal, SubmitBtnColor } from 'components';
import { AppletPassword, AppletPasswordRef } from 'features/Applet/AppletPassword';
import { AppletsSmallTable } from 'features/Respondents/AppletsSmallTable';
import { ChosenAppletData } from 'features/Respondents/Respondents.types';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import theme from 'styles/theme';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';
import { useAsync } from 'hooks';
import { revokeAppletUserApi } from 'api';

import { RemoveAccessPopupProps, Steps } from './RemoveAccessPopup.types';

export const RemoveAccessPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: RemoveAccessPopupProps) => {
  const { t } = useTranslation('app');
  const appletPasswordRef = useRef() as RefObject<AppletPasswordRef>;
  const [appletName, setAppletName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [step, setStep] = useState<Steps>(0);
  const [removeData, setRemoveData] = useState(false);

  const { execute, value: isRemoved, error } = useAsync(revokeAppletUserApi);

  useEffect(() => {
    if (chosenAppletData) {
      setAppletName(chosenAppletData.appletName || '');
      setRespondentName(chosenAppletData.secretUserId || '');
      setStep(1);
    }
  }, [chosenAppletData]);

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const firstScreen = (
    <>
      <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
        {t('removeAccessDescription')}
      </StyledBodyLarge>
      <AppletsSmallTable tableRows={tableRows} />
    </>
  );

  const secondScreen = (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="removeRespondentAccess">
          You are about to remove Respondent{' '}
          <b>
            <>{{ respondentName }}’s</>
          </b>{' '}
          access to the{' '}
          <b>
            <>{{ appletName }}</>
          </b>{' '}
          applet.
        </Trans>
      </StyledBodyLarge>
      <FormControlLabel
        label={
          <StyledBodyLarge>
            <Trans i18nKey="removeRespondentData">
              Remove Respondent{' '}
              <b>
                <>{{ respondentName }}</>
              </b>
              ’s response data also.
            </Trans>
          </StyledBodyLarge>
        }
        control={
          <Checkbox checked={removeData} onChange={() => setRemoveData((prevVal) => !prevVal)} />
        }
      />
    </>
  );

  const thirdExtScreen = (
    <AppletPassword
      ref={appletPasswordRef}
      appletId={chosenAppletData?.appletId}
      setDisabledSubmit={setDisabledSubmit}
      submitCallback={() => handlePopupClose()}
    />
  );

  const thirdScreen = (
    <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
      <Trans i18nKey="confirmRemoveRespondentAccess">
        Are you sure you want to remove access for Respondent{' '}
        <b>
          <>{{ respondentName }}</>
        </b>
        's to the{' '}
        <b>
          <>{{ appletName }}</>
        </b>{' '}
        applet?
      </Trans>
    </StyledBodyLarge>
  );

  const fourthExtScreen = (
    <StyledBodyLarge>
      <Trans i18nKey="confirmRemoveRespondentAccessAndData">
        Are you sure you want to to remove Respondent{' '}
        <b>
          <>{{ respondentName }}</>
        </b>
        's access and all response data within Applet{' '}
        <b>
          <>{{ appletName }}</>
        </b>
        ?
      </Trans>
    </StyledBodyLarge>
  );

  const fourthScreen = (
    <StyledBodyLarge>
      <Trans i18nKey="respondentAccessRemoveSuccess">
        Respondent{' '}
        <b>
          <>{{ respondentName }}</>
        </b>
        's access to{' '}
        <b>
          <>{{ appletName }}</>
        </b>{' '}
        has been removed successfully.
      </Trans>
    </StyledBodyLarge>
  );

  const fourthErrorScreen = (
    <StyledBodyLarge color={variables.palette.semantic.error}>
      <Trans i18nKey="respondentAccessRemoveError">
        Respondent{' '}
        <b>
          <>{{ respondentName }}</>
        </b>
        's access to Applet{' '}
        <b>
          <>{{ appletName }}</>
        </b>{' '}
        has not been removed. Please try again.
      </Trans>
    </StyledBodyLarge>
  );

  const fifthExtScreen = (
    <StyledBodyLarge>
      <Trans i18nKey="respondentAccessAndDataRemoveSuccess">
        Respondent{' '}
        <b>
          <>{{ respondentName }}</>
        </b>
        's access and all response data within Applet{' '}
        <b>
          <>{{ appletName }}</>
        </b>{' '}
        have been removed successfully.
      </Trans>
    </StyledBodyLarge>
  );

  const fifthExtScreenError = (
    <StyledBodyLarge color={variables.palette.semantic.error}>
      <Trans i18nKey="respondentAccessAndDataRemoveError">
        Respondent{' '}
        <b>
          <>{{ respondentName }}</>
        </b>
        ’s access and all response data within Applet{' '}
        <b>
          <>{{ appletName }}</>
        </b>{' '}
        have not been removed. Please try again.
      </Trans>
    </StyledBodyLarge>
  );

  const removeAccess = async () => {
    const { appletId, userId } = chosenAppletData as ChosenAppletData;
    await execute({ appletId, profileId: userId || '', deleteResponse: removeData });
  };

  const submitPassword = () => {
    if (appletPasswordRef?.current) {
      appletPasswordRef.current.submitForm();
    }
  };

  const screens = [
    { component: firstScreen, buttonText: '', hasSecondBtn: false, title: 'removeAccess' },
    {
      component: secondScreen,
      buttonText: 'removeAccess',
      hasSecondBtn: true,
      title: 'removeAccess',
      submitBtnColor: 'error',
    },
    ...(removeData
      ? [
          {
            component: thirdExtScreen,
            buttonText: 'submit',
            hasSecondBtn: true,
            title: 'enterAppletPassword',
            submitForm: submitPassword,
          },
          {
            component: fourthExtScreen,
            buttonText: 'yesRemove',
            hasSecondBtn: true,
            title: 'removeAccessAndData',
            submitForm: removeAccess,
            submitBtnColor: 'error',
          },
          ...(isRemoved
            ? [
                {
                  component: fifthExtScreen,
                  buttonText: 'ok',
                  hasSecondBtn: false,
                  title: 'removeAccessAndData',
                  submitForm: handlePopupClose,
                },
              ]
            : [
                {
                  component: fifthExtScreenError,
                  buttonText: 'retry',
                  hasSecondBtn: true,
                  title: 'removeAccessAndData',
                  submitForm: removeAccess,
                },
              ]),
        ]
      : [
          {
            component: thirdScreen,
            buttonText: 'yesRemove',
            hasSecondBtn: true,
            title: 'removeAccess',
            submitForm: removeAccess,
            submitBtnColor: 'error',
          },
          ...(isRemoved
            ? [
                {
                  component: fourthScreen,
                  buttonText: 'ok',
                  hasSecondBtn: false,
                  title: 'removeAccess',
                  submitForm: handlePopupClose,
                },
              ]
            : [
                {
                  component: fourthErrorScreen,
                  buttonText: 'retry',
                  hasSecondBtn: true,
                  title: 'removeAccess',
                  submitForm: removeAccess,
                },
              ]),
        ]),
  ];

  const onSecondBtnSubmit = () => {
    setStep((prevState) => --prevState as Steps);

    if (disabledSubmit) {
      setDisabledSubmit(false);
    }
  };

  const submitForm = () => {
    if (!error) {
      setStep((prevStep) => ++prevStep as Steps);
    }
    screens[step].submitForm?.();
  };

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={t(screens[step].title)}
      buttonText={t(screens[step].buttonText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      onSecondBtnSubmit={onSecondBtnSubmit}
      secondBtnText={t('back')}
      disabledSubmit={disabledSubmit}
      width="66"
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
