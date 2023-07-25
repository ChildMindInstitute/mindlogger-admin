import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Modal, EnterAppletPassword } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { removeRespondentAccessApi } from 'api';
import { useSetupEnterAppletPassword, useAsync } from 'shared/hooks';
import { workspaces } from 'redux/modules';
import { isManagerOrOwner } from 'shared/utils';

import { ChosenAppletData } from '../../Respondents.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';
import { RespondentAccessPopupProps, Steps } from './RespondentsRemoveAccessPopup.types';
import { getScreens } from './RespondentAccessPopup.utils';

export const RespondentsRemoveAccessPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
  reFetchRespondents,
}: RespondentAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const rolesData = workspaces.useRolesData();
  const appletRoles = chosenAppletData && rolesData?.data?.[chosenAppletData.appletId];
  const { appletPasswordRef, submitForm: submitPassword } = useSetupEnterAppletPassword();

  const [appletName, setAppletName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [secondBtnDisabled, setSecondBtnDisabled] = useState(false);
  const [step, setStep] = useState<Steps>(0);
  const [removeData, setRemoveData] = useState(false);

  const { execute: handleAccessRemove, error } = useAsync(removeRespondentAccessApi);

  const isRemoved = !error;

  useEffect(() => {
    if (chosenAppletData) {
      setAppletName(chosenAppletData?.appletDisplayName || '');
      setRespondentName(chosenAppletData?.respondentSecretId || '');
      setStep(1);
    }
  }, [chosenAppletData]);

  useEffect(() => {
    if (!!appletId && step === 1) {
      setSecondBtnDisabled(true);

      return;
    }

    setSecondBtnDisabled(false);
  }, [step, appletId]);

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
          You are about to remove Respondent
          <b>
            <>{{ respondentName }}’s</>
          </b>
          access to the
          <b>
            <>{{ appletName }}</>
          </b>
          Applet.
        </Trans>
      </StyledBodyLarge>
      {isManagerOrOwner(appletRoles?.[0]) && (
        <FormControlLabel
          label={
            <StyledBodyLarge>
              <Trans i18nKey="removeRespondentData">
                Remove Respondent
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
      )}
    </>
  );

  const getStep = (type: 'next' | 'prev') =>
    setStep((prevStep) => {
      const newStep = type === 'next' ? prevStep + 1 : prevStep - 1;

      return newStep as Steps;
    });

  const thirdExtScreen = (
    <EnterAppletPassword
      ref={appletPasswordRef}
      appletId={chosenAppletData?.appletId ?? ''}
      encryption={chosenAppletData?.encryption}
      submitCallback={() => getStep('next')}
    />
  );

  const removeAccess = async () => {
    const { appletId, respondentId: userId } = chosenAppletData as ChosenAppletData;
    userId &&
      appletId &&
      (await handleAccessRemove({
        userId,
        appletIds: [appletId],
        deleteResponses: removeData,
      }));
  };

  const screens = getScreens({
    firstScreen,
    secondScreen,
    thirdExtScreen,
    respondentName,
    appletName,
    removeData,
    isRemoved,
    submitPassword,
    removeAccess,
    handlePopupClose,
    reFetchRespondents,
  });

  const onSecondBtnSubmit = () => {
    getStep('prev');

    if (disabledSubmit) {
      setDisabledSubmit(false);
    }
  };

  const isLastScreen = (removeData && step === 4) || (!removeData && step === 3);
  const isAppletPwdScreen = removeData && step === 2;

  const submitForm = () => {
    screens[step].submitForm?.();
    if (isLastScreen || isAppletPwdScreen) return;
    getStep('next');
  };

  return (
    <Modal
      open={popupVisible}
      onClose={screens[step]?.onClose || handlePopupClose}
      onSubmit={submitForm}
      title={t(screens[step].title)}
      buttonText={t(screens[step].buttonText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      onSecondBtnSubmit={onSecondBtnSubmit}
      secondBtnText={t('back')}
      disabledSubmit={disabledSubmit}
      disabledSecondBtn={secondBtnDisabled}
      submitBtnColor={screens[step]?.submitBtnColor}
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
