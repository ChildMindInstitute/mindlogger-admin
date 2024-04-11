import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';
import {
  ActivityActionProps,
  ActivityGrid,
  useActivityGrid,
} from 'modules/Dashboard/components/ActivityGrid';
import { MenuActionProps } from 'shared/components';
import { OpenTakeNowModalOptions } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.types';
import { users } from 'modules/Dashboard/state';

export const Activities = () => {
  const { appletId, participantId } = useParams();
  const respondentLoadingStatus = users.useRespondentStatus();
  const respondent = users.useRespondent();
  const [activitiesData, setActivitiesData] = useState<{
    result: DatavizActivity[];
    count: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataTestId = 'dashboard-applet-participant-activities';

  const isParticipantLoading =
    respondentLoadingStatus === 'loading' || respondentLoadingStatus === 'idle';

  const {
    formatRow,
    getActivityById,
    actions: defaultActions,
    TakeNowModal,
    openTakeNowModal,
  } = useActivityGrid(dataTestId, activitiesData);

  /**
   * TODO M2-6223:
   * getAppletActivitiesApi returns activities for the currently logged in user (an admin/collaborator). This behavior is correct for M2-5585, as per the note:
   *  "for this ticket all activities in the applet are assigned to the user as we have not yet introduced the concept of assigning activities to users."
   * This endpoint could be updated to include a `participant_id` param and retrieve _other_ user's assigned activities
   *
   * Alternatively, we can use `getSummaryActivitiesApi` as that endpoint _does_ retrieve the target users activities
   * However this endpoint returns a reduced response (id, name, isPerformanceTask, hasAnswer) that doesn't include all Activity metadata
   * so it needs to be updated to include everything (id, name, image )
   */
  const { execute: getSummaryActivities } = useAsync(
    getSummaryActivitiesApi,
    (response) => {
      const activities = response?.data.result;

      return setActivitiesData({ result: activities, count: activities.length });
    },
    undefined,
    () => setIsLoading(false),
  );

  useEffect(() => {
    if (!appletId || !participantId) return;

    getSummaryActivities({
      appletId,
      targetSubjectId: participantId,
    });
  }, [appletId, participantId, getSummaryActivities]);

  const activities = useMemo(
    () =>
      (activitiesData?.result ?? []).map((activity) => {
        const actions = {
          ...defaultActions,
          takeNow: ({ context }: MenuActionProps<ActivityActionProps>) => {
            const { activityId } = context || { activityId: '' };
            const activity = getActivityById(activityId);
            if (activity) {
              console.log('Opening modal with activity:', activity.id);
              const options: OpenTakeNowModalOptions = {};

              if (participantId && respondent) {
                let label = respondent.result.secretUserId;
                if (respondent.result.nickname) {
                  label += ` (${respondent.result.nickname})`;
                }
                options.subject = { id: participantId, label };
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
    <ActivityGrid
      rows={activities}
      TakeNowModal={TakeNowModal}
      order={'desc'}
      orderBy={''}
      isLoading={isLoading || isParticipantLoading}
      data-testid={dataTestId}
    />
  );
};

export default Activities;
