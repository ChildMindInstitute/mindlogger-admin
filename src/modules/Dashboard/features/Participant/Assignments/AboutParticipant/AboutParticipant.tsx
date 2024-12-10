import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { useAsync } from 'shared/hooks';
import { getAppletTargetSubjectActivitiesApi, ParticipantActivityOrFlow } from 'api';
import { users } from 'redux/modules';
import { ActionsMenu, Spinner, Svg } from 'shared/components';

import { AssignmentsTab, useAssignmentsTab } from '../AssignmentsTab';
import { ActivitiesList } from '../ActivitiesList';
import { ActivityListItem } from '../ActivityListItem';
import { EmptyState } from '../EmptyState';
import { ActivityListItemCounter } from '../ActivityListItemCounter';

const dataTestId = 'participant-details-about-participant';

const AboutParticipant = () => {
  const { t } = useTranslation('app');
  const { appletId, subjectId } = useParams();
  const { useSubject, useSubjectStatus } = users;
  const isLoadingSubject = useSubjectStatus() !== 'success';
  const { result: targetSubject } = useSubject() ?? {};

  const {
    execute: fetchActivities,
    isLoading: isLoadingParticipantActivities,
    value: fetchedActivities,
  } = useAsync(getAppletTargetSubjectActivitiesApi, {
    retainValue: true,
    successCallback: () => {
      if (!appletId || !subjectId) return;
      fetchMetadata({ appletId, subjectId });
    },
  });

  const activities = fetchedActivities?.data.result ?? [];

  const handleRefetch = useCallback(() => {
    if (!appletId || !subjectId) return;

    fetchActivities({ appletId, subjectId });
  }, [appletId, fetchActivities, subjectId]);

  const {
    getActionsMenu,
    onClickAssign,
    onClickNavigateToData,
    modals,
    fetchMetadata,
    isLoadingMetadata,
    metadata,
    metadataById,
  } = useAssignmentsTab({ appletId, targetSubject, handleRefetch, dataTestId });

  const handleClickNavigateToData = (activityOrFlow: ParticipantActivityOrFlow) => {
    if (!targetSubject) return;

    onClickNavigateToData(activityOrFlow, targetSubject.id);
  };

  useEffect(() => {
    handleRefetch();
  }, [handleRefetch]);

  const isLoading = isLoadingSubject || isLoadingParticipantActivities;
  const isTargetSubjectTeam = targetSubject?.tag === 'Team';

  return (
    <AssignmentsTab
      isLoadingMetadata={isLoadingMetadata}
      aboutParticipantCount={metadata?.targetActivitiesCountExisting}
      byParticipantCount={metadata?.respondentActivitiesCountExisting}
    >
      {isLoading && <Spinner />}

      {!isLoading && !activities.length && (
        <EmptyState
          icon="about-participant"
          onClickAssign={isTargetSubjectTeam ? undefined : onClickAssign}
          title={
            isTargetSubjectTeam
              ? t('participantDetails.aboutParticipantEmptyTeamMember')
              : t('participantDetails.aboutParticipantEmpty')
          }
        />
      )}

      {!!activities.length && (
        <ActivitiesList
          title={t('participantDetails.activitiesAndFlows')}
          count={fetchedActivities?.data.count ?? 0}
        >
          {activities.map((activity, index) => (
            <ActivityListItem key={activity.id} activityOrFlow={activity}>
              <ActivityListItemCounter
                icon="by-participant"
                label={t('participantDetails.respondents')}
                count={metadataById?.[activity.id]?.respondentsCount}
                isLoading={isLoadingMetadata}
              />

              <ActivityListItemCounter
                icon="folder-opened"
                label={t('participantDetails.submissions')}
                count={metadataById?.[activity.id]?.subjectSubmissionsCount}
                isLoading={isLoadingMetadata}
              />

              <Button
                variant="outlined"
                onClick={() => handleClickNavigateToData(activity)}
                sx={{ mr: 0.4 }}
                className="primary-button"
                disableRipple
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
