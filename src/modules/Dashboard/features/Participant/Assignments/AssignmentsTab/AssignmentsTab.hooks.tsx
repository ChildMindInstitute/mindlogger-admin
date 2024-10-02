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
import { ActivityAssignmentStatus, getAppletActivitiesApi, ParticipantActivityOrFlow } from 'api';
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
  const {
    execute: fetchActivities,
    isLoading,
    value: fetchedActivities,
  } = useAsync(getAppletActivitiesApi, { retainValue: true });

  const activities: Activity[] = useMemo(
    () => fetchedActivities?.data?.result.activitiesDetails ?? [],
    [fetchedActivities],
  );

  useEffect(() => {
    if (!appletId) return;

    fetchActivities({ params: { appletId } });
  }, [appletId, fetchActivities]);

  const handleCloseDrawer = (shouldRefetch?: boolean) => {
    setShowActivityAssign(false);
    setShowActivityUnassign(false);
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

  const onClickAssign = useCallback((activityOrFlow?: ParticipantActivityOrFlow) => {
    if (activityOrFlow) setSelectedActivityOrFlow(activityOrFlow);
    setShowActivityAssign(true);
  }, []);

  const getActionsMenu = useCallback(
    (activityOrFlow: ParticipantActivityOrFlow) => {
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

      const isEditDisplayed =
        canEdit &&
        (isFlow ||
          !activityOrFlow.isPerformanceTask ||
          EditablePerformanceTasks.includes(performanceTaskType ?? ''));
      const isAssignable =
        status === ActivityAssignmentStatus.Active || status === ActivityAssignmentStatus.Inactive;
      const isAssigned = !!assignments?.some((a) => a.targetSubject.id === targetSubject?.id);
      const isAssignDisplayed = canAssign && !autoAssign;
      const isUnassignDisplayed = canAssign && isAssignable && (autoAssign || isAssigned);

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
            setShowExportData(true);
          },
          disabled: !id,
          icon: <Svg id="export" />,
          title: t('exportData'),
          isDisplayed: canAccessData,
        },
        {
          'data-testid': `${dataTestId}-assign`,
          action: () => onClickAssign(activityOrFlow),
          icon: <Svg id="file-plus" />,
          title: isFlow ? t('assignFlow') : t('assignActivity'),
          isDisplayed: canAssign && !autoAssign,
          disabled: !isAssignable,
          tooltip:
            !isAssignable &&
            (isFlow ? t('assignFlowDisabledTooltip') : t('assignActivityDisabledTooltip')),
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
                userId: respondentSubject.userId,
                isTeamMember: respondentSubject.tag === 'Team',
              },
              targetSubject: targetSubject && {
                ...targetSubject,
                secretId: targetSubject.secretUserId,
                userId: targetSubject.userId,
                isTeamMember: targetSubject.tag === 'Team',
              },
            }),
          icon: <Svg id="play-outline" />,
          isDisplayed: canDoTakeNow,
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

      <DataExportPopup
        chosenAppletData={appletData}
        filters={{
          activityId: selectedActivityOrFlow?.id,
          targetSubjectId: selectedTargetSubjectId,
        }}
        isAppletSetting
        popupVisible={showExportData}
        setPopupVisible={() => {
          setShowExportData(false);
          setSelectedActivityOrFlow(undefined);
        }}
      />

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
        targetSubjectId={targetSubject?.id}
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

  return { getActionsMenu, onClickNavigateToData, onClickAssign, isLoading, modals };
};
