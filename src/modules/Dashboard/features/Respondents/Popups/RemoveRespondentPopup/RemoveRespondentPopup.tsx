import { useEffect, useState, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Modal, EnterAppletPassword } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { deleteSubjectApi } from 'api';
import { useSetupEnterAppletPassword, useAsync } from 'shared/hooks';
import { workspaces } from 'redux/modules';
import { isManagerOrOwner, toggleBooleanState } from 'shared/utils';

import { AppletsSmallTable } from '../../AppletsSmallTable';
import { RemoveRespondentPopupProps, Steps } from './RemoveRespondentPopup.types';
import { getScreens } from './RemoveRespondentPopup.utils';

export const RemoveRespondentPopup = ({
  popupVisible,
  tableRows,
  chosenAppletData,
  onClose,
}: RemoveRespondentPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams() || {};
  const rolesData = workspaces.useRolesData();
  const appletRoles = chosenAppletData && rolesData?.data?.[chosenAppletData.appletId];
  const { appletPasswordRef, submitForm: submitPassword } = useSetupEnterAppletPassword();

  const [appletName, setAppletName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [step, setStep] = useState<Steps>(0);
  const [removeData, setRemoveData] = useState(false);

  const isLastScreen = (removeData && step === 4) || (!removeData && step === 3);
  const isDeleteScreen = (removeData && step === 3) || (!removeData && step === 2);
  const isAppletPwdScreen = removeData && step === 2;
  const isLastScreenRef = useRef(isLastScreen);

  const getStep = (type: 'next' | 'prev') =>
    setStep((prevStep) => {
      const newStep = type === 'next' ? prevStep + 1 : prevStep - 1;

      return newStep as Steps;
    });
  const deleteSubjectCallback = () => {
    if (isLastScreenRef.current) return;

    return getStep('next');
  };

  const {
    execute: handleSubjectDelete,
    error,
    isLoading,
  } = useAsync(deleteSubjectApi, deleteSubjectCallback, deleteSubjectCallback);

  const isRemoved = !error;
  const isFirstStepWithAppletId = !!appletId && step === 1;
  const dataTestid = 'dashboard-respondents-remove-access-popup';

  const onCloseHandler = () => onClose();

  const firstScreen = (
    <>
      <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
        {t('removeAccessDescription')}
      </StyledBodyLarge>
      <AppletsSmallTable tableRows={tableRows} data-testid={`${dataTestid}-respondents-table`} />
    </>
  );

  const secondScreen = (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="removeRespondentAccess">
          You are about to remove
          <b>
            <>{{ respondentName }}’s</>
          </b>
          from Applet
          <b>
            <>{{ appletName }}</>
          </b>
          .
        </Trans>
      </StyledBodyLarge>
      {isManagerOrOwner(appletRoles?.[0]) && (
        <FormControlLabel
          label={
            <StyledBodyLarge>
              <Trans i18nKey="removeRespondentData">
                Also remove
                <b>
                  <>{{ respondentName }}</>
                </b>
                ’s response data for Applet
                <b>
                  <>{{ appletName }}</>
                </b>
                .
              </Trans>
            </StyledBodyLarge>
          }
          control={<Checkbox checked={removeData} onChange={toggleBooleanState(setRemoveData)} />}
          data-testid={`${dataTestid}-remove-data`}
        />
      )}
    </>
  );

  const thirdExtScreen = (
    <EnterAppletPassword
      ref={appletPasswordRef}
      appletId={chosenAppletData?.appletId ?? ''}
      encryption={chosenAppletData?.encryption}
      submitCallback={() => getStep('next')}
      data-testid={`${dataTestid}-enter-password`}
    />
  );

  const removeAccess = async () => {
    const { subjectId } = chosenAppletData || {};
    if (!subjectId) return;

    await handleSubjectDelete({
      subjectId,
      deleteAnswers: removeData,
    });
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
    onClose,
  });

  const onSecondBtnSubmit = () => {
    if (isFirstStepWithAppletId) {
      onCloseHandler();

      return;
    }
    getStep('prev');

    if (disabledSubmit) {
      setDisabledSubmit(false);
    }
  };

  const submitForm = () => {
    screens[step].submitForm?.();
    if (isLastScreen || isAppletPwdScreen || isDeleteScreen) return;
    getStep('next');
  };

  useEffect(() => {
    if (chosenAppletData) {
      setAppletName(chosenAppletData?.appletDisplayName || '');
      setRespondentName(chosenAppletData?.respondentSecretId || '');
      setStep(1);
    }
  }, [chosenAppletData]);

  useEffect(() => {
    isLastScreenRef.current = isLastScreen;
  }, [isLastScreen]);

  return (
    <Modal
      open={popupVisible}
      onClose={screens[step]?.onClose || onCloseHandler}
      onSubmit={submitForm}
      title={t(screens[step].title)}
      buttonText={t(screens[step].buttonText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      onSecondBtnSubmit={onSecondBtnSubmit}
      secondBtnText={t(isFirstStepWithAppletId ? 'cancel' : 'back')}
      disabledSubmit={disabledSubmit || isLoading}
      submitBtnColor={screens[step]?.submitBtnColor}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
