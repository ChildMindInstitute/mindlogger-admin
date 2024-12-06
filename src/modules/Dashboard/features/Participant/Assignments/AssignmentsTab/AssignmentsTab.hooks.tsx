import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Activity, applet, workspaces } from 'redux/modules';
import { useAsync, useEncryptionStorage, useFeatureFlags } from 'shared/hooks';
import {
  checkIfCanAccessData,
  checkIfCanEdit,
  checkIfCanManageParticipants,
  checkIfFullAccess,
  getIsWebSupported,
} from 'shared/utils';
import {
  ActivityAssignmentStatus,
  getAppletActivitiesApi,
  getAppletParticipantActivitiesMetadataApi,
  ParticipantActivityOrFlow,
  ParticipantActivityOrFlowMetadata,
} from 'api';
import { ItemResponseType } from 'shared/consts';
import { MenuItemType, Svg } from 'shared/components';
import { EditablePerformanceTasksType } from 'modules/Builder/features/Activities/Activities.types';
import { getPerformanceTaskPath } from 'modules/Builder/features/Activities/Activities.utils';
import { page } from 'resources';
import { UnlockAppletPopup } from 'modules/Dashboard/features/Respondents/Popups/UnlockAppletPopup';
import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { useTakeNowModal } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal';
import { ActivityAssignDrawer, ActivityUnassignDrawer } from 'modules/Dashboard/components';
import { EditablePerformanceTasks } from 'modules/Builder/features/Activities/Activities.const';
import { RespondentDetails } from 'modules/Dashboard/types';

import { UseAssignmentsTabProps } from './AssignmentsTab.types';

export const useAssignmentsTab = ({
  appletId,
  targetSubject,
  respondentSubject,
  handleRefetch,
  dataTestId,
}: UseAssignmentsTabProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const navigate = useNavigate();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');
  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId });
  const appletData = applet.useAppletData()?.result ?? null;

  const [showActivityAssign, setShowActivityAssign] = useState(false);
  const [showActivityUnassign, setShowActivityUnassign] = useState(false);
  const [showEncryptionCheck, setShowEncryptionCheck] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [selectedActivityOrFlow, setSelectedActivityOrFlow] = useState<ParticipantActivityOrFlow>();
  const [selectedTargetSubjectId, setSelectedTargetSubjectId] = useState<string | undefined>();

  const canEdit = checkIfCanEdit(roles);
  const canDoTakeNow = checkIfFullAccess(roles);
  const canAccessData = checkIfCanAccessData(roles);
  const canAssign = checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;

  // TODO: We only call getAppletActivitiesApi because we need full items data for each activity.
  // Remove this and associated effect below after supportedPlatforms prop is returned by API.
  // https://mindlogger.atlassian.net/browse/M2-7906
  const { execute: fetchActivities, value: fetchedActivities } = useAsync(getAppletActivitiesApi, {
    retainValue: true,
  });

  const activities: Activity[] = useMemo(
    () => fetchedActivities?.data?.result.activitiesDetails ?? [],
    [fetchedActivities],
  );

  const {
    execute: fetchCounts,
    isLoading: isLoadingCounts,
    value: counts,
  } = useAsync(getAppletParticipantActivitiesMetadataApi, { retainValue: true });

  const countsById = useMemo(
    () =>
      counts?.data.result.activitiesOrFlows.reduce(
        (acc, counts) => {
          acc[counts.activityOrFlowId] = counts;

          return acc;
        },
        {} as Record<string, ParticipantActivityOrFlowMetadata>,
      ),
    [counts?.data.result.activitiesOrFlows],
  );

  useEffect(() => {
    if (!appletId) return;

    fetchActivities({ params: { appletId } });
  }, [appletId, fetchActivities]);

  const handleCloseDrawer = (shouldRefetch?: boolean) => {
    setShowActivityAssign(false);
    setShowActivityUnassign(false);

    // Allow drawer to transition out before clearing activity/flow to prevent unintended
    // rendering of possible empty state before drawer closes
    setTimeout(() => {
      setSelectedActivityOrFlow(undefined);
      setSelectedTargetSubjectId(undefined);
    }, 300);

    if (shouldRefetch) handleRefetch?.();
  };

  const navigateToData = useCallback(
    (activityOrFlow?: ParticipantActivityOrFlow, targetSubjectId?: string) => {
      if (!appletId || !activityOrFlow || !targetSubjectId) return;

      const { id, isFlow } = activityOrFlow;

      navigate(
        generatePath(
          isFlow
            ? page.appletParticipantActivityDetailsFlowDataSummary
            : page.appletParticipantActivityDetailsDataSummary,
          {
            appletId,
            subjectId: targetSubjectId,
            [isFlow ? 'activityFlowId' : 'activityId']: id,
          },
        ),
      );
    },
    [appletId, navigate],
  );

  const onClickNavigateToData = useCallback(
    (activityOrFlow: ParticipantActivityOrFlow, targetSubjectId: string) => {
      setSelectedActivityOrFlow(activityOrFlow);
      setSelectedTargetSubjectId(targetSubjectId);

      if (!hasEncryptionCheck) {
        setShowEncryptionCheck(true);
      } else {
        navigateToData(activityOrFlow, targetSubjectId);
      }
    },
    [hasEncryptionCheck, navigateToData],
  );

  const onClickEdit = useCallback(
    ({ id, isFlow, isPerformanceTask, performanceTaskType }: ParticipantActivityOrFlow) => {
      if (!appletId) return;

      let path: string;
      if (isFlow) {
        path = generatePath(page.builderAppletActivityFlowItemAbout, {
          appletId,
          activityFlowId: id,
        });
      } else {
        const navigateTo =
          isPerformanceTask && performanceTaskType
            ? // Additional validation for flanker, gyroscope, touch and unity is done in before
              // menu item is displayed, as these are the only editable options. So it's safe to
              // assume the task is EditablePerformanceTasksType.
              getPerformanceTaskPath(performanceTaskType as unknown as EditablePerformanceTasksType)
            : page.builderAppletActivity;

        path = generatePath(navigateTo, {
          appletId,
          activityId: id,
        });
      }

      navigate(path);
    },
    [appletId, navigate],
  );

  const onClickAssign = useCallback(
    (activityOrFlow?: ParticipantActivityOrFlow, targetSubjectArg?: RespondentDetails) => {
      if (activityOrFlow) setSelectedActivityOrFlow(activityOrFlow);
      setSelectedTargetSubjectId(targetSubjectArg?.id ?? targetSubject?.id);

      setShowActivityAssign(true);
    },
    [targetSubject],
  );

  /**
   * Returns action menu items for the given activity or flow, based on activity and assignment
   * status and user permissions.
   *
   * If `targetSubjectArg` is omitted, assumes general tab context (main activity/flow list of
   * either the About Participant or By Participant tab).
   *
   * If `targetSubjectArg` is provided, assumes expanded view context (list of target subjects for
   * the current respondent).
   */
  const getActionsMenu = useCallback(
    (activityOrFlow: ParticipantActivityOrFlow, targetSubjectArg = targetSubject) => {
      const { id, autoAssign, assignments, isFlow, performanceTaskType, status } = activityOrFlow;

      // TODO: Remove extra steps below after supportedPlatforms prop is returned by API
      // https://mindlogger.atlassian.net/browse/M2-7906
      const activityIds = isFlow ? activityOrFlow.activityIds : [id];
      let items: { responseType: ItemResponseType }[] = [];
      const hydratedActivities = activities.filter(({ id }) => id && activityIds.includes(id));
      items = hydratedActivities.reduce<{ responseType: ItemResponseType }[]>(
        (items, activity) => [...items, ...activity.items],
        [],
      );
      const isWebSupported = getIsWebSupported(items);

      const isExpandedViewContext = !!respondentSubject && !!targetSubjectArg;
      const isEditDisplayed =
        !isExpandedViewContext &&
        canEdit &&
        (isFlow ||
          !activityOrFlow.isPerformanceTask ||
          EditablePerformanceTasks.includes(performanceTaskType ?? ''));
      const isAssignable =
        status === ActivityAssignmentStatus.Active || status === ActivityAssignmentStatus.Inactive;
      const isLimitedRespondent = respondentSubject && !respondentSubject.userId;
      const isTargetTeamMember = targetSubjectArg?.tag === 'Team';
      const isAssigned = !!assignments?.some(
        (a) =>
          a.targetSubject.id === targetSubjectArg?.id ||
          a.respondentSubject.id === respondentSubject?.id,
      );
      const isAssignDisplayed =
        canAssign &&
        (!autoAssign || status === ActivityAssignmentStatus.Hidden || isLimitedRespondent);
      const isAssignDisabled = !isAssignable || isTargetTeamMember || isLimitedRespondent;
      const isUnassignDisplayed =
        canAssign && isAssignable && (autoAssign || isAssigned) && !isLimitedRespondent;
      // TODO: Until https://mindlogger.atlassian.net/browse/M2-7906 is tackled to obviate the
      // need to load all activities (a slow operation), to prevent that request from holding up
      // interacting with the page (which only affects the enabled state of the Take Now menu item),
      // just hide the Take Now menu item altogether until activities have been loaded. Remove
      // this condition after M2-7906 has been completed.
      const isTakeNowDisplayed = canDoTakeNow && !!activities.length;

      let assignTooltip: string | undefined;
      if (status === ActivityAssignmentStatus.Hidden) {
        assignTooltip = isFlow
          ? t('assignFlowDisabledTooltip')
          : t('assignActivityDisabledTooltip');
      } else if (isTargetTeamMember) {
        assignTooltip = t('assignToTeamMemberTooltip');
      } else if (isLimitedRespondent) {
        assignTooltip = t('assignToLimitedRespondentTooltip');
      }

      const showDivider =
        (isEditDisplayed || canAccessData || isAssignDisplayed || isUnassignDisplayed) &&
        canDoTakeNow;

      return [
        {
          'data-testid': `${dataTestId}-edit`,
          action: () => onClickEdit(activityOrFlow),
          icon: <Svg id="edit" />,
          isDisplayed: isEditDisplayed,
          title: isFlow ? t('editFlow') : t('editActivity'),
        },
        {
          'data-testid': `${dataTestId}-export`,
          action: () => {
            setSelectedActivityOrFlow(activityOrFlow);
            setSelectedTargetSubjectId(targetSubjectArg?.id);
            setShowExportData(true);
          },
          disabled: !id,
          icon: <Svg id="export" />,
          title: t('exportData'),
          isDisplayed: canAccessData && !!targetSubjectArg,
        },
        {
          'data-testid': `${dataTestId}-assign`,
          action: () => onClickAssign(activityOrFlow, targetSubjectArg),
          icon: <Svg id="file-plus" />,
          title: isFlow ? t('assignFlow') : t('assignActivity'),
          isDisplayed: isAssignDisplayed,
          disabled: isAssignDisabled,
          tooltip: assignTooltip,
        },
        {
          'data-testid': `${dataTestId}-unassign`,
          action: () => {
            setSelectedActivityOrFlow(activityOrFlow);
            setShowActivityUnassign(true);
          },
          icon: <Svg id="clear-calendar" />,
          title: isFlow ? t('unassignFlow') : t('unassignActivity'),
          isDisplayed: isUnassignDisplayed,
          disabled: autoAssign,
          tooltip:
            autoAssign &&
            (isFlow ? t('unassignFlowDisabledTooltip') : t('unassignActivityDisabledTooltip')),
        },
        { type: MenuItemType.Divider, isDisplayed: showDivider },
        {
          'data-testid': `${dataTestId}-take-now`,
          action: () =>
            openTakeNowModal(activityOrFlow, {
              sourceSubject: respondentSubject && {
                ...respondentSubject,
                secretId: respondentSubject.secretUserId,
                isTeamMember: respondentSubject.tag === 'Team',
              },
              targetSubject: targetSubjectArg && {
                ...targetSubjectArg,
                secretId: targetSubjectArg.secretUserId,
                isTeamMember: isTargetTeamMember,
              },
            }),
          icon: <Svg id="play-outline" />,
          isDisplayed: isTakeNowDisplayed,
          title: t('takeNow.menuItem'),
          disabled: !isWebSupported,
          tooltip: !isWebSupported && t('activityIsMobileOnly'),
        },
      ];
    },
    [
      activities,
      canAccessData,
      canAssign,
      canDoTakeNow,
      canEdit,
      dataTestId,
      onClickAssign,
      onClickEdit,
      openTakeNowModal,
      respondentSubject,
      t,
      targetSubject,
    ],
  );

  const modals = (
    <>
      <UnlockAppletPopup
        appletId={String(appletId)}
        popupVisible={showEncryptionCheck}
        setPopupVisible={(isVisible) => {
          setShowEncryptionCheck(isVisible);
          if (!isVisible) setSelectedActivityOrFlow(undefined);
        }}
        onSubmitHandler={() => navigateToData(selectedActivityOrFlow, selectedTargetSubjectId)}
      />

      {showExportData && (
        <DataExportPopup
          chosenAppletData={appletData}
          filters={{
            activityId: selectedActivityOrFlow?.isFlow ? undefined : selectedActivityOrFlow?.id,
            flowId: selectedActivityOrFlow?.isFlow ? selectedActivityOrFlow.id : undefined,
            sourceSubjectId: respondentSubject?.id,
            targetSubjectId: selectedTargetSubjectId,
          }}
          isAppletSetting
          popupVisible={showExportData}
          setPopupVisible={(isVisible) => {
            setShowExportData(isVisible);

            if (!isVisible) {
              setSelectedActivityOrFlow(undefined);
              setSelectedTargetSubjectId(undefined);
            }
          }}
        />
      )}

      <ActivityAssignDrawer
        appletId={appletId}
        open={showActivityAssign}
        onClose={handleCloseDrawer}
        activityId={
          selectedActivityOrFlow && !selectedActivityOrFlow.isFlow
            ? selectedActivityOrFlow.id
            : undefined
        }
        activityFlowId={selectedActivityOrFlow?.isFlow ? selectedActivityOrFlow.id : undefined}
        respondentSubjectId={respondentSubject?.id}
        targetSubjectId={selectedTargetSubjectId}
      />

      <ActivityUnassignDrawer
        activityOrFlow={selectedActivityOrFlow}
        appletId={appletId}
        open={showActivityUnassign}
        onClose={handleCloseDrawer}
      />

      <TakeNowModal />
    </>
  );

  return {
    getActionsMenu,
    onClickNavigateToData,
    onClickAssign,
    modals,
    fetchCounts,
    isLoadingCounts,
    counts: counts?.data.result,
    countsById,
  };
};
