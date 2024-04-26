import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DatavizActivity, getAppletActivitiesApi } from 'api';
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
  const subjectLoadingStatus = users.useSubjectStatus();
  const subject = users.useSubject();
  const [activitiesData, setActivitiesData] = useState<{
    result: DatavizActivity[];
    count: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataTestId = 'dashboard-applet-participant-activities';

  const isSubjectLoading = subjectLoadingStatus === 'loading' || subjectLoadingStatus === 'idle';

  const {
    formatRow,
    getActivityById,
    actions: defaultActions,
    TakeNowModal,
    openTakeNowModal,
  } = useActivityGrid(dataTestId, activitiesData);

  // TODO M2-6223: Update this call to include a `participant_id` param
  const { execute: getActivities } = useAsync(
    getAppletActivitiesApi,
    (response) => {
      const activities = response?.data.result.activitiesDetails;

      return setActivitiesData({ result: activities, count: activities.length });
    },
    undefined,
    () => setIsLoading(false),
  );

  useEffect(() => {
    if (!appletId || !participantId) return;

    getActivities({
      params: {
        appletId,
      },
    });
  }, [appletId, getActivities]);

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

              if (participantId && subject) {
                options.subject = {
                  id: participantId,
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
    <ActivityGrid
      rows={activities}
      TakeNowModal={TakeNowModal}
      order={'desc'}
      orderBy={''}
      isLoading={isLoading || isSubjectLoading}
      data-testid={dataTestId}
    />
  );
};

export default Activities;
