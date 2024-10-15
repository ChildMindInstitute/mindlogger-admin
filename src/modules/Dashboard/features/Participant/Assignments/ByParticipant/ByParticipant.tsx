import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAsync } from 'shared/hooks';
import { getAppletRespondentSubjectActivitiesApi } from 'api';
import { users } from 'redux/modules';
import { ActionsMenu, Spinner } from 'shared/components';

import { AssignmentsTab, useAssignmentsTab } from '../AssignmentsTab';
import { ActivitiesList } from '../ActivitiesList';
import { ActivityListItem } from '../ActivityListItem';
import { EmptyState } from '../EmptyState';

const dataTestId = 'participant-details-about-participant';

const ByParticipant = () => {
  const { t } = useTranslation('app');
  const { appletId, subjectId } = useParams();
  const { useSubject, useSubjectStatus } = users;
  const isLoadingSubject = useSubjectStatus() !== 'success';
  const { result: respondentSubject } = useSubject() ?? {};

  const {
    execute: fetchActivities,
    isLoading: isLoadingActivities,
    value: fetchedActivities,
  } = useAsync(getAppletRespondentSubjectActivitiesApi, { retainValue: true });

  const activities = fetchedActivities?.data.result ?? [];

  const handleRefetch = useCallback(() => {
    // Avoid fetching activities for respondent if respondent is a limited account
    if (!appletId || !subjectId || !respondentSubject?.userId) return;

    fetchActivities({ appletId, subjectId });
  }, [appletId, fetchActivities, respondentSubject?.userId, subjectId]);

  const {
    getActionsMenu,
    onClickAssign,
    isLoading: isLoadingHook,
    modals,
  } = useAssignmentsTab({ appletId, respondentSubject, handleRefetch, dataTestId });

  /*
  TODO: Handler for navigating to data when card is expanded
  https://mindlogger.atlassian.net/browse/M2-7921
  const handleClickNavigateToData = (activityOrFlow: ParticipantActivityOrFlow, targetSubject: RespondentDetails) => {
    if (!respondentSubject) return;

    onClickNavigateToData(activityOrFlow, targetSubject.id);
  };
  */

  useEffect(() => {
    handleRefetch();
  }, [handleRefetch]);

  const isLoading = isLoadingSubject || isLoadingActivities || isLoadingHook;
  const isRespondentLimited = !respondentSubject?.userId;

  return (
    <AssignmentsTab>
      {isLoading && <Spinner />}

      {!isLoading && !activities.length && (
        <EmptyState
          icon="by-participant"
          onClickAssign={isRespondentLimited ? undefined : onClickAssign}
          title={
            isRespondentLimited
              ? t('participantDetails.byParticipantEmptyLimitedAccount')
              : t('participantDetails.byParticipantEmpty')
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
              <ActionsMenu
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: -6, horizontal: 'right' }}
                buttonColor="secondary"
                menuItems={getActionsMenu(activity)}
                data-testid={`${dataTestId}-${index}`}
              />

              {/* TODO: Add expand/collapse button
                  https://mindlogger.atlassian.net/browse/M2-7921 */}
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

export default ByParticipant;
