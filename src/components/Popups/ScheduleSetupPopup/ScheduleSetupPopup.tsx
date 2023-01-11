import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal } from 'components/Popups';
import { Table, UiType } from 'components/Tables';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { APPLET_PAGES } from 'utils/constants';

import { ScheduleSetupPopupProps } from './ScheduleSetupPopup.types';
import { headCells } from './ScheduleSetupPopup.const';

export const ScheduleSetupPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ScheduleSetupPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

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
      onSubmit={handleBackClick}
      title={t('individualScheduleSetup')}
      buttonText={chosenAppletData ? t('back') : ''}
      hasSecondBtn={!!chosenAppletData}
      secondBtnText={t('yes')}
      onSecondBtnSubmit={handlePopupSubmit}
      actionsAlign="end"
      width="66"
    >
      <StyledModalWrapper>
        {chosenAppletData && !chosenAppletData.hasIndividualSchedule ? (
          <StyledBodyLarge
            sx={{ marginTop: theme.spacing(-1) }}
            dangerouslySetInnerHTML={{
              __html: t('respondentIsAMemberOfTheDefaultSchedule', {
                secretUserId: chosenAppletData.secretUserId,
                appletName: chosenAppletData.appletName,
              }),
            }}
          />
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('pleaseSelectAppletToSchedule')}
            </StyledBodyLarge>
            <Table
              columns={headCells}
              rows={tableRows}
              orderBy="appletName"
              uiType={UiType.secondary}
            />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
