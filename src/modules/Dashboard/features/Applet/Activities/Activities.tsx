import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getAppletActivitiesApi } from 'api';
import { Spinner } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { ActivityGrid, useActivityGrid } from 'modules/Dashboard/components/ActivityGrid';
import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { FlowGrid } from 'modules/Dashboard/components/FlowGrid';
import { Activity, ActivityFlow } from 'redux/modules';
import { applet } from 'shared/state/Applet';
import { StyledFlexColumn } from 'shared/styles';

import { ActivitiesSectionHeader } from './ActivitiesSectionHeader';
import { ActivitiesToolbar } from './ActivitiesToolbar';

const dataTestId = 'dashboard-applet-activities';

export const Activities = () => {
  const [activityId, setActivityId] = useState<string>();
  const [showExportPopup, setShowExportPopup] = useState(false);
  const { result: appletData } = applet.useAppletData() ?? {};
  const { appletId } = useParams();
  const { t } = useTranslation('app');
  const { execute, isLoading, value, previousValue } = useAsync(getAppletActivitiesApi);

  const activities: Activity[] = useMemo(
    () => (value ?? previousValue)?.data?.result?.activitiesDetails ?? [],
    [value, previousValue],
  );
  const flows: ActivityFlow[] =
    (value ?? previousValue)?.data?.result?.appletDetail?.activityFlows ?? [];
  const showContent =
    (isLoading && previousValue?.data?.result?.activitiesDetails?.length > 0) || !isLoading;

  const { formatRow, TakeNowModal } = useActivityGrid(
    dataTestId,
    {
      result: activities,
      count: activities.length,
    },
    useCallback((activityId: string) => {
      setActivityId(activityId);
      setShowExportPopup(true);
    }, []),
  );

  const formattedActivities = useMemo(
    () => activities.map((activity) => formatRow(activity)),
    [activities, formatRow],
  );

  useEffect(() => {
    if (!appletId) return;

    execute({ params: { appletId } });
  }, [appletId, execute]);

  return (
    <StyledFlexColumn sx={{ gap: 2.4, height: '100%' }}>
      {isLoading && <Spinner />}

      <ActivitiesToolbar appletId={appletId} data-testid={dataTestId} sx={{ p: 3.2, pb: 0 }} />

      {showContent && (
        <StyledFlexColumn sx={{ gap: 4.8, overflow: 'auto', p: 3.2, pt: 0 }}>
          {!!flows?.length && (
            <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
              <ActivitiesSectionHeader title={t('flows')} count={flows?.length ?? 0} />

              <FlowGrid
                applet={appletData}
                activities={activities}
                data-testid={dataTestId}
                flows={flows}
              />
            </StyledFlexColumn>
          )}

          <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
            <ActivitiesSectionHeader
              title={t('activities')}
              count={formattedActivities?.length ?? 0}
            />

            <ActivityGrid
              TakeNowModal={TakeNowModal}
              data-testid={dataTestId}
              order="desc"
              orderBy=""
              rows={formattedActivities}
            />
          </StyledFlexColumn>
        </StyledFlexColumn>
      )}

      {showExportPopup && (
        <DataExportPopup
          chosenAppletData={appletData ?? null}
          filters={{ activityId }}
          isAppletSetting
          popupVisible={showExportPopup}
          setPopupVisible={() => {
            setShowExportPopup(false);
            setActivityId(undefined);
          }}
        />
      )}
    </StyledFlexColumn>
  );
};
