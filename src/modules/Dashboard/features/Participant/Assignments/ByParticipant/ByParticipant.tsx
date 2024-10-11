import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAsync } from 'shared/hooks';
import {
  getAppletRespondentSubjectActivitiesApi,
  getTargetSubjectsByRespondentApi,
  ParticipantActivityOrFlow,
  TargetSubjectsByRespondent,
} from 'api';
import { users } from 'redux/modules';
import { ActionsMenu, Spinner } from 'shared/components';
import { RespondentDetails } from 'modules/Dashboard/types';

import { AssignmentsTab, useAssignmentsTab } from '../AssignmentsTab';
import { ActivitiesList } from '../ActivitiesList';
import { ActivityListItem } from '../ActivityListItem';
import { EmptyState } from '../EmptyState';
import { ExpandedView } from './ExpandedView';

const dataTestId = 'participant-details-about-participant';

const ByParticipant = () => {
  const { t } = useTranslation('app');
  const { appletId, subjectId: respondentSubjectId } = useParams();
  const { useSubject, useSubjectStatus } = users;
  const isLoadingRespondentSubject = useSubjectStatus() !== 'success';
  const { result: respondentSubject } = useSubject() ?? {};
  const [expandedViewsData, setExpandedViewsData] = useState<
    Record<string, TargetSubjectsByRespondent | undefined>
  >({});
  const [expandedViewsLoading, setExpandedViewsLoading] = useState<Record<string, boolean>>({});

  const {
    execute: fetchActivities,
    isLoading: isLoadingActivities,
    value: fetchedActivities,
  } = useAsync(getAppletRespondentSubjectActivitiesApi, { retainValue: true });

  const activities = fetchedActivities?.data.result ?? [];

  const handleRefetchExpandedView = useCallback(
    async (activityOrFlowId: string) => {
      if (!respondentSubjectId) return;

      setExpandedViewsLoading((prev) => ({ ...prev, [activityOrFlowId]: true }));

      try {
        const { data } = await getTargetSubjectsByRespondentApi({
          activityOrFlowId,
          subjectId: respondentSubjectId,
        });
        // Add or update the correspondent element in expandedViewsData
        setExpandedViewsData((prev) => ({ ...prev, [activityOrFlowId]: data.result }));
      } finally {
        setExpandedViewsLoading((prev) => ({ ...prev, [activityOrFlowId]: false }));
      }
    },
    [respondentSubjectId],
  );

  const handleRefetchActivities = useCallback(() => {
    // Avoid fetching activities for respondent if respondent is a limited account
    if (!appletId || !respondentSubject?.id || !respondentSubject.userId) return;

    fetchActivities({ appletId, subjectId: respondentSubject.id });
  }, [appletId, fetchActivities, respondentSubject]);

  const handleRefetchAll = useCallback(() => {
    handleRefetchActivities();

    // Refresh target subject data for any expanded views
    Object.entries(expandedViewsData).forEach(([id, viewData]) => {
      if (viewData) handleRefetchExpandedView(id);
    });
  }, [handleRefetchActivities, expandedViewsData, handleRefetchExpandedView]);

  const {
    getActionsMenu,
    onClickAssign,
    onClickNavigateToData,
    isLoading: isLoadingHook,
    modals,
  } = useAssignmentsTab({
    appletId,
    respondentSubject,
    handleRefetch: handleRefetchAll,
    dataTestId,
  });

  const handleClickNavigateToData = (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubject: RespondentDetails,
  ) => {
    if (!respondentSubject) return;

    onClickNavigateToData(activityOrFlow, targetSubject.id);
  };

  const handleClickToggleExpandedView = useCallback(
    (isExpanded: boolean, activityOrFlowId: string) => {
      if (!respondentSubject) return;

      if (isExpanded) {
        handleRefetchExpandedView(activityOrFlowId);
      } else {
        // If expanded view is closed, remove data to free up memory and minimize refetches
        // (after delay to account for transition)
        setTimeout(() => {
          setExpandedViewsData((prev) => ({ ...prev, [activityOrFlowId]: undefined }));
        }, 300);
      }
    },
    [handleRefetchExpandedView, respondentSubject],
  );

  useEffect(() => {
    handleRefetchActivities();
  }, [handleRefetchActivities]);

  const isLoading = isLoadingRespondentSubject || isLoadingActivities || isLoadingHook;
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

      {!!activities.length && respondentSubject && (
        <ActivitiesList
          title={t('participantDetails.activitiesAndFlows')}
          count={fetchedActivities?.data.count ?? 0}
        >
          {activities.map((activity, index) => (
            <ActivityListItem
              key={activity.id}
              activityOrFlow={activity}
              onClickToggleExpandedView={(isExpanded) =>
                handleClickToggleExpandedView(isExpanded, activity.id)
              }
              expandedView={
                <ExpandedView
                  activityOrFlow={activity}
                  targetSubjects={expandedViewsData[activity.id]}
                  getActionsMenu={getActionsMenu}
                  onClickViewData={handleClickNavigateToData}
                  data-test-id={`${dataTestId}-${index}`}
                />
              }
              isLoadingExpandedView={!!expandedViewsLoading[activity.id]}
            >
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

export default ByParticipant;
