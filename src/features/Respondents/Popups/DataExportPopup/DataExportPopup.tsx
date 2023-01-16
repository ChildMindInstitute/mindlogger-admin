import { useTranslation } from 'react-i18next';

import { Modal } from 'components';
import { AppletsSmallTable } from 'features/Respondents/AppletsSmallTable';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

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
  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };
  const handleEnterAppletPwdSubmit = () => {
    console.log('enter applet pwd on data export submit');
    // setPopupVisible(false);
  };

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handleEnterAppletPwdSubmit}
      title={showSecondScreen ? t('enterAppletPassword') : t('dataExport')}
      buttonText={showSecondScreen ? t('submit') : ''}
      width="66"
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <h2>second screen</h2>
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
