import { RefObject, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Modal, SubmitBtnColor } from 'components';
import {
  EnterAppletPassword,
  AppletPasswordRef,
} from 'features/Applet/Password/EnterAppletPassword';
import { AppletsSmallTable } from 'features/Respondents/AppletsSmallTable';
import { ChosenAppletData } from 'features/Respondents/Respondents.types';
import { StyledModalWrapper, StyledBodyLarge } from 'styles/styledComponents';
import theme from 'styles/theme';
import { useAsync } from 'hooks';
import { revokeAppletUserApi } from 'api';

import { RemoveAccessPopupProps, Steps } from './RemoveAccessPopup.types';
import { getScreens } from './RespondentAccessPopup.const';

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
    </>
  );

  const thirdExtScreen = (
    <EnterAppletPassword
      ref={appletPasswordRef}
      appletId={chosenAppletData?.appletId}
      submitCallback={() => handlePopupClose()}
    />
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
  });

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
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
