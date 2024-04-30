import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getAppletActivitiesApi, getAppletApi } from 'api';
import { Spinner } from 'shared/components';
import { useAsync } from 'shared/hooks';
import {
  ActivitiesData,
  ActivityGrid,
  useActivityGrid,
} from 'modules/Dashboard/components/ActivityGrid';
import { FlowGrid } from 'modules/Dashboard/components/FlowGrid';
import { Activity, ActivityFlow } from 'redux/modules';
import { StyledFlexColumn } from 'shared/styles';

import { ActivitiesSectionHeader } from './ActivitiesSectionHeader';
import { ActivitiesToolbar } from './ActivitiesToolbar';

export const Activities = () => {
  const { appletId } = useParams();
  const { t } = useTranslation('app');
  const [flows, setFlows] = useState<ActivityFlow[]>([]);
  const [flowActivities, setFlowActivities] = useState<Activity[]>([]);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const dataTestId = 'dashboard-applet-activities';
  const { formatRow, TakeNowModal } = useActivityGrid(dataTestId, activitiesData);

  const { execute: getActivities, isLoading: isLoadingActivities } = useAsync(
    getAppletActivitiesApi,
    (response) => {
      const activitiesDetails = response?.data.result.activitiesDetails;

      return setActivitiesData({ result: activitiesDetails, count: activitiesDetails.length });
    },
  );

  const { execute: getFlows, isLoading: isLoadingFlows } = useAsync(getAppletApi, (response) => {
    if (response?.data?.result) {
      setFlows(response.data.result.activityFlows ?? []);
      setFlowActivities(response.data.result.activities ?? []);
    }
  });

  const isLoading = isLoadingActivities || isLoadingFlows;

  useEffect(() => {
    if (!appletId) return;
    getFlows({ appletId });
    getActivities({ params: { appletId } });

    return () => {
      setActivitiesData(null);
    };
  }, [appletId, getActivities, getFlows]);

  const activities = useMemo(
    () => (activitiesData?.result ?? []).map((activity) => formatRow(activity)),
    [activitiesData, formatRow],
  );

  return (
    <StyledFlexColumn sx={{ gap: 2.4, maxHeight: '100%' }}>
      <ActivitiesToolbar appletId={appletId} data-testid={dataTestId} sx={{ px: 3.2, pt: 3.2 }} />

      {isLoading ? (
        <Spinner />
      ) : (
        <StyledFlexColumn sx={{ gap: 4.8, overflow: 'auto', p: 3.2 }}>
          {flows?.length && (
            <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
              <ActivitiesSectionHeader title={t('flows')} count={flows?.length ?? 0} />

              <FlowGrid appletId={appletId} activities={flowActivities} flows={flows} />
            </StyledFlexColumn>
          )}

          <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
            <ActivitiesSectionHeader title={t('activities')} count={activities?.length ?? 0} />

            <ActivityGrid
              TakeNowModal={TakeNowModal}
              data-testid={dataTestId}
              order="desc"
              orderBy=""
              rows={activities}
            />
          </StyledFlexColumn>
        </StyledFlexColumn>
      )}
    </StyledFlexColumn>
  );
};
