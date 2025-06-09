import { useCallback, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { createIndividualEventsApi } from 'api';
import { page } from 'resources';
import { Modal } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage, Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils';

import { AppletsSmallTable } from '../../AppletsSmallTable';
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
  const { appletId } = useParams();
  const {
    appletId: chosenAppletId,
    appletDisplayName,
    respondentSecretId,
    respondentId,
    hasIndividualSchedule,
    subjectId,
  } = chosenAppletData || {};
  const showSecondScreen = chosenAppletData && !chosenAppletData.hasIndividualSchedule;
  const { execute: createIndividualEvents, error } = useAsync(createIndividualEventsApi);

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const handleBackClick = () => setChosenAppletData(null);

  const handlePopupSubmit = useCallback(async () => {
    if (!chosenAppletId || !respondentId) return;

    if (!hasIndividualSchedule) {
      await createIndividualEvents({ appletId: chosenAppletId, respondentId });
    }

    setPopupVisible(false);
    navigate(generatePath(page.appletParticipantSchedule, { appletId: chosenAppletId, subjectId }));
    Mixpanel.track({
      action: MixpanelEventType.ViewIndividualCalendarClick,
      [MixpanelProps.AppletId]: appletId,
    });
  }, [
    chosenAppletId,
    createIndividualEvents,
    hasIndividualSchedule,
    navigate,
    respondentId,
    setPopupVisible,
    subjectId,
    appletId,
  ]);

  useEffect(() => {
    if (hasIndividualSchedule) {
      handlePopupSubmit();
    }
  }, [handlePopupSubmit, hasIndividualSchedule]);

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
      disabledSecondBtn={!!appletId}
      data-testid="dashboard-respondents-view-calendar-popup"
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <StyledBodyLarge sx={{ marginTop: theme.spacing(-1) }}>
            <Trans
              components={{ 1: <strong />, 3: <strong /> }}
              i18nKey="respondentIsAMemberOfTheDefaultSchedule"
              t={t}
              values={{ appletName: appletDisplayName, secretUserId: respondentSecretId }}
            />
          </StyledBodyLarge>
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('selectAppletToSchedule')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
        {error && (
          <StyledBodyLarge color={variables.palette.error} sx={{ m: theme.spacing(1, 0) }}>
            {getErrorMessage(error)}
          </StyledBodyLarge>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
