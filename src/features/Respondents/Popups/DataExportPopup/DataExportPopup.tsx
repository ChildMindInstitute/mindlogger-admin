import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components';
import { AppletsSmallTable } from 'features/Respondents/AppletsSmallTable';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { AppletPassword } from 'features/Applet/AppletPassword';

import { ScheduleSetupPopupProps } from './DataExportPopup.types';

export const DataExportPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ScheduleSetupPopupProps) => {
  const { t } = useTranslation('app');
  const showSecondScreen = !!chosenAppletData;
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };
  const handleModalSubmit = () => {
    setIsSubmitted(true);
    console.log('enter applet pwd on data export submit');
    // setPopupVisible(false);
  };

  const handleAppletPwdSubmit = () => console.log('submit');

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handleModalSubmit}
      title={showSecondScreen ? t('enterAppletPassword') : t('dataExport')}
      buttonText={showSecondScreen ? t('submit') : ''}
      disabledSubmit={disabledSubmit}
      width="66"
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <AppletPassword
            appletId={chosenAppletData.appletId}
            setDisabledSubmit={setDisabledSubmit}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            submitCallback={handleAppletPwdSubmit}
          />
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('pleaseSelectAppletToExportRespondentsData')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
