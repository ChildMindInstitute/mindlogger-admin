import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { useAsync } from 'shared/hooks';
import {
  getAppletRespondentSubjectActivitiesApi,
  getTargetSubjectsByRespondentApi,
  ParticipantActivityOrFlow,
  TargetSubjectsByRespondent,
} from 'api';
import { users } from 'redux/modules';
import { ActionsMenu, Spinner, Tooltip } from 'shared/components';
import { SubjectDetails } from 'modules/Dashboard/types';
import { StyledFlexTopCenter } from 'shared/styles';
import { DateFormats } from 'shared/consts';

import { AssignmentsTab, useAssignmentsTab } from '../AssignmentsTab';
import { ActivitiesList } from '../ActivitiesList';
import { ActivityListItem } from '../ActivityListItem';
import { EmptyState } from '../EmptyState';
import { ExpandedView } from './ExpandedView';
import { ActivityListItemCounter } from '../ActivityListItemCounter';

const dataTestId = 'participant-details-by-participant';

const ByParticipant = () => {
  const { t } = useTranslation('app');
  const { appletId, subjectId: respondentSubjectId } = useParams();
  const { useSubject, useSubjectStatus } = users;
  const isLoadingRespondentSubject = useSubjectStatus() !== 'success';
  const { result: respondentSubject } = useSubject() ?? {};
  const [expandedViewsData, setExpandedViewsData] = useState<
    Record<string, TargetSubjectsByRespondent>
  >({});
  const [expandedViewsLoading, setExpandedViewsLoading] = useState<Record<string, boolean>>({});

  const {
    execute: fetchActivities,
    isLoading: isLoadingParticipantActivities,
    value: fetchedActivities,
  } = useAsync(getAppletRespondentSubjectActivitiesApi, {
    retainValue: true,
    successCallback: () => {
      if (!appletId || !respondentSubjectId) return;
      fetchMetadata({ appletId, subjectId: respondentSubjectId });
    },
  });

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
    if (!appletId || !respondentSubject?.id) return;

    fetchActivities({ appletId, subjectId: respondentSubject.id });
  }, [appletId, fetchActivities, respondentSubject]);

  const handleRefetchAll = useCallback(() => {
    handleRefetchActivities();

    // Refresh target subject data for any expanded views
    Object.entries(expandedViewsData).forEach(([id]) => void handleRefetchExpandedView(id));
  }, [handleRefetchActivities, expandedViewsData, handleRefetchExpandedView]);

  const {
    getActionsMenu,
    onClickAssign,
    onClickNavigateToData,
    modals,
    fetchMetadata,
    isLoadingMetadata,
    metadata,
    metadataById,
  } = useAssignmentsTab({
    appletId,
    respondentSubject,
    handleRefetch: handleRefetchAll,
    dataTestId,
  });

  const handleClickNavigateToData = (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubject: SubjectDetails,
  ) => {
    if (!respondentSubject) return;

    onClickNavigateToData(activityOrFlow, targetSubject.id);
  };

  const handleClickToggleExpandedView = useCallback(
    (isExpanded: boolean, activityOrFlowId: string) => {
      if (!respondentSubject) return;

      if (isExpanded) {
        void handleRefetchExpandedView(activityOrFlowId);
      } else {
        // If expanded view is closed, remove data to free up memory and minimize refetches
        // (after delay to account for transition)
        setTimeout(() => {
          setExpandedViewsData((prev) => {
            const { [activityOrFlowId]: _, ...rest } = prev;

            return rest;
          });
        }, 300);
      }
    },
    [handleRefetchExpandedView, respondentSubject],
  );

  useEffect(() => {
    handleRefetchActivities();
  }, [handleRefetchActivities]);

  const isLoading = isLoadingRespondentSubject || isLoadingParticipantActivities;
  const isRespondentLimited = !respondentSubject?.userId;

  return (
    <AssignmentsTab
      isLoadingMetadata={isLoadingMetadata}
      aboutParticipantCount={metadata?.targetActivitiesCountExisting}
      byParticipantCount={metadata?.respondentActivitiesCountExisting}
    >
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
          maxWidth={isRespondentLimited ? '57.2rem' : undefined}
          dataTestId={dataTestId}
        />
      )}

      {!!activities.length && respondentSubject && (
        <ActivitiesList
          title={t('participantDetails.activitiesAndFlows')}
          count={fetchedActivities?.data.count ?? 0}
        >
          {activities.map((activity, index) => {
            const lastSubmissionDate = metadataById?.[activity.id]?.respondentLastSubmissionDate;
            const tooltip = lastSubmissionDate ? (
              <>
                <strong>{t('participantDetails.lastSubmission')}</strong>{' '}
                {format(new Date(lastSubmissionDate), DateFormats.MonthDayYearTime)}
              </>
            ) : (
              t('participantDetails.noDataYet')
            );

            return (
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
                    data-testid={`${dataTestId}-${index}-expanded-view`}
                  />
                }
                isLoadingExpandedView={expandedViewsLoading[activity.id]}
                dataTestId={dataTestId}
              >
                <ActivityListItemCounter
                  icon="by-participant"
                  label={t('participantDetails.subjects')}
                  count={metadataById?.[activity.id]?.subjectsCount}
                  isLoading={isLoadingMetadata}
                />

                <Tooltip tooltipTitle={tooltip} placement="top">
                  <StyledFlexTopCenter sx={{ zIndex: 1 }}>
                    <ActivityListItemCounter
                      icon="folder-opened"
                      label={t('participantDetails.submissions')}
                      count={metadataById?.[activity.id]?.respondentSubmissionsCount}
                      isLoading={isLoadingMetadata}
                    />
                  </StyledFlexTopCenter>
                </Tooltip>

                <ActionsMenu
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: -6, horizontal: 'right' }}
                  buttonColor="secondary"
                  menuItems={getActionsMenu(activity)}
                  data-testid={`${dataTestId}-${index}`}
                />
              </ActivityListItem>
            );
          })}

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
