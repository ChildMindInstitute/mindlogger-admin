import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getAppletActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';
import {
  ActivitiesData,
  ActivityGrid,
  useActivityGrid,
} from 'modules/Dashboard/components/ActivityGrid';

export const Activities = () => {
  const { appletId } = useParams();
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataTestId = 'dashboard-applet-activities';

  const { formatRow, TakeNowModal } = useActivityGrid(dataTestId, activitiesData);

  const { execute: getActivities } = useAsync(
    getAppletActivitiesApi,
    (response) => {
      const activitiesDetails = response?.data.result.activitiesDetails;

      return setActivitiesData({ result: activitiesDetails, count: activitiesDetails.length });
    },
    undefined,
    () => setIsLoading(false),
  );

  useEffect(() => {
    if (!appletId) return;
    getActivities({
      params: {
        appletId,
      },
    });

    return () => {
      setActivitiesData(null);
    };
  }, [appletId, getActivities]);

  useEffect(() => {
    if (!appletId) return;

    return () => {
      setActivitiesData(null);
    };
  }, [appletId]);

  const activities = useMemo(
    () => (activitiesData?.result ?? []).map((activity) => formatRow(activity)),
    [activitiesData, formatRow],
  );

  return (
    <ActivityGrid
      rows={activities}
      TakeNowModal={TakeNowModal}
      data-testid={dataTestId}
      isLoading={isLoading}
      order={'desc'}
      orderBy={''}
    />
  );
};
