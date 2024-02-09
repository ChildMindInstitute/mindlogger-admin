import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { createIndividualEventsApi } from 'api';
import { page } from 'resources';
import { Modal } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { theme, StyledModalWrapper, StyledBodyLarge, variables } from 'shared/styles';
import { Mixpanel, getErrorMessage } from 'shared/utils';

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
  const showSecondScreen = chosenAppletData && !chosenAppletData.hasIndividualSchedule;
  const appletName = chosenAppletData?.appletDisplayName || '';
  const secretUserId = chosenAppletData?.respondentSecretId || '';

  const { execute: createIndividualEvents, error } = useAsync(createIndividualEventsApi);

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };
  const handleBackClick = () => setChosenAppletData(null);

  const handlePopupSubmit = async () => {
    const { appletId, respondentId, hasIndividualSchedule } = chosenAppletData || {};
    if (!appletId || !respondentId) return;
    if (!hasIndividualSchedule) {
      await createIndividualEvents({ appletId, respondentId });
    }
    setPopupVisible(false);
    navigate(
      generatePath(page.appletScheduleIndividual, {
        appletId,
        respondentId,
      }),
    );
    Mixpanel.track('View Individual calendar click');
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
      disabledSecondBtn={!!appletId}
      data-testid="dashboard-respondents-view-calendar-popup"
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <StyledBodyLarge sx={{ marginTop: theme.spacing(-1) }}>
            <Trans i18nKey="respondentIsAMemberOfTheDefaultSchedule">
              Respondent
              <strong>
                <>{{ secretUserId }}</>
              </strong>
              is a member of the Default Schedule within the
              <strong>
                <>{{ appletName }}</>
              </strong>
              Applet. Do you want to set an Individual schedule for this Respondent?
            </Trans>
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
          <StyledBodyLarge color={variables.palette.semantic.error} sx={{ m: theme.spacing(1, 0) }}>
            {getErrorMessage(error)}
          </StyledBodyLarge>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
