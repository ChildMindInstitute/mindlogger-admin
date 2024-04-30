import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DatavizActivity, getAppletActivitiesApi, getAppletApi } from 'api';
import { useAsync } from 'shared/hooks';
import {
  ActivityActionProps,
  ActivityGrid,
  useActivityGrid,
} from 'modules/Dashboard/components/ActivityGrid';
import { MenuActionProps, Spinner } from 'shared/components';
import { FlowGrid } from 'modules/Dashboard/components/FlowGrid';
import { OpenTakeNowModalOptions } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.types';
import { ActivitiesToolbar } from 'modules/Dashboard/features/Applet/Activities/ActivitiesToolbar';
import { ActivitiesSectionHeader } from 'modules/Dashboard/features/Applet/Activities/ActivitiesSectionHeader';
import { users } from 'modules/Dashboard/state';
import { Activity, ActivityFlow } from 'redux/modules';
import { StyledFlexColumn } from 'shared/styles';

export const Activities = () => {
  const { appletId, subjectId } = useParams();
  const { t } = useTranslation('app');
  const subjectLoadingStatus = users.useSubjectStatus();
  const subject = users.useSubject();
  const [activitiesData, setActivitiesData] = useState<{
    result: DatavizActivity[];
    count: number;
  } | null>(null);
  const [flows, setFlows] = useState<ActivityFlow[]>([]);
  const [flowActivities, setFlowActivities] = useState<Activity[]>([]);
  const dataTestId = 'dashboard-applet-participant-activities';
  const isLoadingSubject = subjectLoadingStatus === 'loading' || subjectLoadingStatus === 'idle';

  const {
    formatRow,
    getActivityById,
    actions: defaultActions,
    TakeNowModal,
    openTakeNowModal,
  } = useActivityGrid(dataTestId, activitiesData);

  // TODO M2-6223: Update this call to include a `participant_id` param
  const { execute: getActivities, isLoading: isLoadingActivities } = useAsync(
    getAppletActivitiesApi,
    (response) => {
      const activities = response?.data.result.activitiesDetails;

      return setActivitiesData({ result: activities, count: activities.length });
    },
    undefined,
  );

  const { execute: getFlows, isLoading: isLoadingFlows } = useAsync(getAppletApi, (response) => {
    if (response?.data?.result) {
      setFlows(response.data.result.activityFlows ?? []);
      setFlowActivities(response.data.result.activities ?? []);
    }
  });

  const isLoading = isLoadingActivities || isLoadingFlows || isLoadingSubject;

  useEffect(() => {
    if (!appletId) return;

    getFlows({ appletId });
    getActivities({ params: { appletId } });
  }, [appletId, getActivities, getFlows]);

  const activities = useMemo(
    () =>
      (activitiesData?.result ?? []).map((activity) => {
        const actions = {
          ...defaultActions,
          takeNow: ({ context }: MenuActionProps<ActivityActionProps>) => {
            const { activityId } = context || { activityId: '' };
            const activity = getActivityById(activityId);
            if (activity) {
              const options: OpenTakeNowModalOptions = {};

              if (subjectId && subject) {
                options.subject = {
                  id: subjectId,
                  secretId: subject.result.secretUserId,
                  nickname: subject.result.nickname,
                };
              }

              openTakeNowModal(activity, options);
            }
          },
        };

        return formatRow(activity, actions);
      }),
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

              <FlowGrid
                appletId={appletId}
                activities={flowActivities}
                flows={flows}
                subject={subject?.result}
              />
            </StyledFlexColumn>
          )}

          <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
            <ActivitiesSectionHeader title={t('activities')} count={activities?.length ?? 0} />

            <ActivityGrid
              rows={activities}
              TakeNowModal={TakeNowModal}
              data-testid={dataTestId}
              order="desc"
              orderBy=""
            />
          </StyledFlexColumn>
        </StyledFlexColumn>
      )}
    </StyledFlexColumn>
  );
};

export default Activities;
