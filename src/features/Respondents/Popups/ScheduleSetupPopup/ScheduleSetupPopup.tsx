import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { Modal } from 'components';
import { AppletsSmallTable } from 'features/Respondents/AppletsSmallTable';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { APPLET_PAGES } from 'consts';

import { ScheduleSetupPopupProps } from './ScheduleSetupPopup.types';

export const ScheduleSetupPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ScheduleSetupPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const showSecondScreen = chosenAppletData && !chosenAppletData.hasIndividualSchedule;
  const appletName = chosenAppletData?.appletName || '';
  const secretUserId = chosenAppletData?.secretUserId || '';

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };
  const handleBackClick = () => setChosenAppletData(null);

  const handlePopupSubmit = () => {
    setPopupVisible(false);
    navigate(`/${chosenAppletData?.appletId}/${APPLET_PAGES.schedule}`);
  };

  useEffect(() => {
    if (chosenAppletData?.hasIndividualSchedule) {
      handlePopupSubmit();
    }
  }, [chosenAppletData]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handlePopupSubmit}
      title={t('individualScheduleSetup')}
      buttonText={showSecondScreen ? t('yes') : ''}
      hasSecondBtn={Boolean(showSecondScreen)}
      secondBtnText={t('back')}
      onSecondBtnSubmit={handleBackClick}
      width="66"
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <StyledBodyLarge sx={{ marginTop: theme.spacing(-1) }}>
            <Trans i18nKey="respondentIsAMemberOfTheDefaultSchedule">
              <strong>Respondent </strong>
              <strong>
                <>{{ secretUserId }}</>
              </strong>
              is a member of the Default Schedule within the {{ appletName }} applet. Do you want to
              set an Individual schedule for this Respondent?
            </Trans>
          </StyledBodyLarge>
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('pleaseSelectAppletToSchedule')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
