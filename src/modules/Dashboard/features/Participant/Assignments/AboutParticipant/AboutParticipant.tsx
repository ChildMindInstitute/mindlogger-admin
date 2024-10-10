import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { useAsync } from 'shared/hooks';
import { getAppletTargetSubjectActivitiesApi, ParticipantActivityOrFlow } from 'api';
import { users } from 'redux/modules';
import { ActionsMenu, Spinner, Svg } from 'shared/components';

import { AssignmentsTab, useAssignmentsTab } from '../AssignmentsTab';
import { EmptyState } from './EmptyState';
import { ActivitiesList } from '../ActivitiesList';
import { ActivityListItem } from '../ActivityListItem';

const dataTestId = 'participant-details-about-participant';

const AboutParticipant = () => {
  const { t } = useTranslation('app');
  const { appletId, subjectId } = useParams();
  const { useSubject, useSubjectStatus } = users;
  const isLoadingSubject = useSubjectStatus() !== 'success';
  const { result: targetSubject } = useSubject() ?? {};

  const {
    execute: fetchActivities,
    isLoading: isLoadingActivities,
    value: fetchedActivities,
  } = useAsync(getAppletTargetSubjectActivitiesApi, { retainValue: true });

  const activities = fetchedActivities?.data.result ?? [];

  const handleRefetch = useCallback(() => {
    if (!appletId || !subjectId) return;

    fetchActivities({ appletId, subjectId });
  }, [appletId, fetchActivities, subjectId]);

  const {
    getActionsMenu,
    onClickAssign,
    onClickNavigateToData,
    isLoading: isLoadingHook,
    modals,
  } = useAssignmentsTab({ appletId, targetSubject, handleRefetch, dataTestId });

  const handleClickNavigateToData = (activityOrFlow: ParticipantActivityOrFlow) => {
    if (!targetSubject) return;

    onClickNavigateToData(activityOrFlow, targetSubject.id);
  };

  useEffect(() => {
    handleRefetch();
  }, [handleRefetch]);

  const isLoading = isLoadingSubject || isLoadingActivities || isLoadingHook;

  return (
    <AssignmentsTab>
      {isLoading && <Spinner />}

      {!isLoading && !activities.length && (
        <EmptyState onClickAssign={onClickAssign} isTeamMember={targetSubject?.tag === 'Team'} />
      )}

      {!!activities.length && (
        <ActivitiesList
          title={t('participantDetails.activitiesAndFlows')}
          count={fetchedActivities?.data.count ?? 0}
        >
          {activities.map((activity, index) => (
            <ActivityListItem
              key={activity.id}
              activityOrFlow={activity}
              onClick={() => handleClickNavigateToData(activity)}
            >
              <Button
                variant="outlined"
                onClick={() => handleClickNavigateToData(activity)}
                sx={{ mr: 0.4 }}
                data-testid={`${dataTestId}-${index}-view-data`}
              >
                <Svg id="chart" width="18" height="18" fill="currentColor" />
                {t('viewData')}
              </Button>

              <ActionsMenu
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: -6, horizontal: 'right' }}
                buttonColor="secondary"
                menuItems={getActionsMenu(activity)}
                data-testid={`${dataTestId}-${index}`}
              />
            </ActivityListItem>
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

      {modals}
    </AssignmentsTab>
  );
};

export default AboutParticipant;
