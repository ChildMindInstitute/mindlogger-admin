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
import { EmptyState } from './EmptyState';
import { ActivitiesList } from '../ActivitiesList';
import { ActivityListItem } from '../ActivityListItem';
import { ExpandedView } from './ExpandedView';

const dataTestId = 'participant-details-about-participant';

const ByParticipant = () => {
  const { t } = useTranslation('app');
  const { appletId, subjectId: respondentSubjectId } = useParams();
  const { useSubject, useSubjectStatus } = users;
  const isLoadingRespondentSubject = useSubjectStatus() !== 'success';
  const { result: respondentSubject } = useSubject() ?? {};
  const [expandedViewsData, setExpandedViewsData] = useState<
    Array<{ id: string; data: TargetSubjectsByRespondent }>
  >([]);
  const [expandedViewsLoading, setExpandedViewsLoading] = useState<string[]>([]);

  const {
    execute: fetchActivities,
    isLoading: isLoadingActivities,
    value: fetchedActivities,
  } = useAsync(getAppletRespondentSubjectActivitiesApi, { retainValue: true });

  const activities = fetchedActivities?.data.result ?? [];

  const handleRefetchExpandedView = useCallback(
    async (activityOrFlowId: string) => {
      if (!respondentSubjectId) return;

      setExpandedViewsLoading((prev) => [...prev, activityOrFlowId]);

      try {
        const { data } = await getTargetSubjectsByRespondentApi({
          activityOrFlowId,
          subjectId: respondentSubjectId,
        });
        setExpandedViewsData((prev) => [...prev, { id: activityOrFlowId, data: data.result }]);
      } finally {
        setExpandedViewsLoading((prev) => prev.filter((id) => activityOrFlowId !== id));
      }
    },
    [respondentSubjectId],
  );

  const handleRefetchAll = useCallback(() => {
    // Avoid fetching activities for respondent if respondent is a limited account
    if (!appletId || !respondentSubject?.id || !respondentSubject.userId) return;

    fetchActivities({ appletId, subjectId: respondentSubject.id });

    // Refresh target subject data for any expanded views
    expandedViewsData.forEach(({ id: viewId }) => handleRefetchExpandedView(viewId));
  }, [appletId, fetchActivities, handleRefetchExpandedView, respondentSubject, expandedViewsData]);

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
        // If data hasn't been loaded for this activity/flow yet, fetch it
        if (!expandedViewsData.some(({ id }) => id === activityOrFlowId)) {
          handleRefetchExpandedView(activityOrFlowId);
        }
      } else {
        // If expanded view is closed, remove data to free up memory and minimize refetches
        // (after delay to account for transition)
        setTimeout(() => {
          setExpandedViewsData((prev) => prev.filter(({ id }) => id !== activityOrFlowId));
        }, 300);
      }
    },
    [handleRefetchExpandedView, respondentSubject, expandedViewsData],
  );

  useEffect(() => {
    handleRefetchAll();
  }, [handleRefetchAll]);

  const isLoading = isLoadingRespondentSubject || isLoadingActivities || isLoadingHook;

  return (
    <AssignmentsTab>
      {isLoading && <Spinner />}

      {!isLoading && !activities.length && (
        <EmptyState onClickAssign={onClickAssign} isLimitedAccount={!respondentSubject?.userId} />
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
                  respondentSubject={respondentSubject}
                  targetSubjects={expandedViewsData.find(({ id }) => id === activity.id)?.data}
                  isLoading={!!expandedViewsLoading.find((id) => id === activity.id)}
                  onClickViewData={handleClickNavigateToData}
                  data-test-id={`${dataTestId}-${index}`}
                />
              }
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
