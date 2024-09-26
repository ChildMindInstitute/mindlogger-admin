import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAsync } from 'shared/hooks';
import { getAppletSubjectActivitiesApi } from 'api';
import { users } from 'redux/modules';
import { Spinner } from 'shared/components';

import { AssignmentsTab } from '../AssignmentsTab';
import { EmptyState } from './EmptyState';
import { AssignmentsTabHandle } from '../AssignmentsTab/AssignmentsTab.types';
import { ActivitiesList } from '../ActivitiesList';

const AboutParticipant = () => {
  const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });
  const { appletId, subjectId } = useParams();
  const tabRef = useRef<AssignmentsTabHandle>(null);
  const { useSubject, useSubjectStatus } = users;
  const isLoadingSubject = useSubjectStatus() !== 'success';
  const { result: subject } = useSubject() ?? {};

  const {
    execute: fetchActivities,
    isLoading: isLoadingActivities,
    value: fetchedActivities,
  } = useAsync(getAppletSubjectActivitiesApi, { retainValue: true });

  const activities = useMemo(
    () =>
      fetchedActivities
        ? [
            ...fetchedActivities.data.result.activityFlows,
            ...fetchedActivities.data.result.activities,
          ]
        : [],
    [fetchedActivities],
  );

  const handleRefetch = useCallback(() => {
    if (!appletId || !subjectId) return;

    fetchActivities({ appletId, subjectId });
  }, [appletId, fetchActivities, subjectId]);

  useEffect(() => {
    handleRefetch();
  }, [handleRefetch]);

  const isLoading = isLoadingSubject || isLoadingActivities;

  return (
    <AssignmentsTab ref={tabRef} targetSubjectId={subjectId}>
      {isLoading && <Spinner />}

      {!isLoading && !activities && (
        <EmptyState
          onClickAssign={() => tabRef.current?.showAssign()}
          isTeamMember={subject?.tag === 'Team'}
        />
      )}

      {!!activities.length && (
        <ActivitiesList title={t('activitiesAndFlows')} count={activities.length}>
          {activities.map((activity) => (
            <div key={activity.id}>{activity.name}</div>
          ))}

          {/* TODO: Add lazy load button
              https://mindlogger.atlassian.net/browse/M2-7827 */}
        </ActivitiesList>
      )}

      {/* TODO: Add deleted entries
          https://mindlogger.atlassian.net/browse/M2-7827
          <ActivitiesList title={t('deleted')} count={deleted.length}>
            {deleted.map(…)}
          </ActivitiesList> */}
    </AssignmentsTab>
  );
};

export default AboutParticipant;
