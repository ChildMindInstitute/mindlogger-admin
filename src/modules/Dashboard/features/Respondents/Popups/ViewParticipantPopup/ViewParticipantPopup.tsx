import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';

import { Modal } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { page } from 'resources';

import { ViewParticipantPopupProps } from './ViewParticipantPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';

export const ViewParticipantPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ViewParticipantPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const handlePopupClose = useCallback(() => {
    setChosenAppletData(null);
    setPopupVisible(false);
  }, [setChosenAppletData, setPopupVisible]);

  useEffect(() => {
    if (chosenAppletData) {
      const { appletId, subjectId } = chosenAppletData;
      navigate(generatePath(page.appletParticipantActivities, { appletId, subjectId }));
      handlePopupClose();
    }
  }, [chosenAppletData, handlePopupClose, navigate]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      title={t('viewData')}
      data-testid={'dashboard-respondents-view-participant-popup'}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
          {t('viewDataDescription')}
        </StyledBodyLarge>
        <AppletsSmallTable tableRows={tableRows} />
      </StyledModalWrapper>
    </Modal>
  );
};
