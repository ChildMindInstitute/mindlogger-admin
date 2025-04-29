import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { AssignedActivity, AssignedActivityFlow, getAppletSubjectActivitiesApi } from 'api';
import { useAsync, useEncryptionStorage, useFeatureFlags } from 'shared/hooks';
import {
  ActivityActionProps,
  ActivityGrid,
  useActivityGrid,
} from 'modules/Dashboard/components/ActivityGrid';
import { MenuActionProps, Spinner } from 'shared/components';
import { FlowGrid } from 'modules/Dashboard/components/FlowGrid';
import { OpenTakeNowModalOptions } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.types';
import { ActivitiesSectionHeader } from 'modules/Dashboard/features/Applet/Activities/ActivitiesSectionHeader';
import { users } from 'modules/Dashboard/state';
import { applet } from 'shared/state/Applet';
import { StyledFlexColumn } from 'shared/styles';
import { page } from 'resources';
import { workspaces } from 'shared/state';
import { checkIfCanAccessData, Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils';
import { ActivityAssignDrawer, ActivityUnassignDrawer } from 'modules/Dashboard/components';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';
import { TEAM_MEMBER_ROLES } from 'shared/consts';
import { useGetAppletActivitiesQuery } from 'modules/Dashboard/api/apiSlice';
import { ExportDataSetting } from 'shared/features/AppletSettings';

import { ActivityOrFlowId } from './Activities.types';
import { UnlockAppletPopup } from '../../Respondents/Popups/UnlockAppletPopup';
import { ParticipantActivitiesToolbar } from './ParticipantActivitiesToolbar';

const dataTestId = 'dashboard-applet-participant-activities';

/**
 * @deprecated Use the updated Participant Details design, which defaults to `AboutParticipant` tab
 * defined in `modules/Dashboard/features/Participant/Assignments/AboutParticipant`
 */
export const Activities = () => {
  const { result: appletData } = applet.useAppletData() ?? {};
  const { appletId, subjectId } = useParams();
  const { t } = useTranslation('app');
  const subjectLoadingStatus = users.useSubjectStatus();
  const subject = users.useSubject();
  const navigate = useNavigate();
  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [showActivityAssign, setShowActivityAssign] = useState(false);
  const [showActivityUnassign, setShowActivityUnassign] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [selectedActivityOrFlowId, setSelectedActivityOrFlowId] = useState<ActivityOrFlowId>();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const {
    featureFlags: { enableActivityAssign },
  } = useFeatureFlags();

  const { data: fetchedActivities, isLoading: isLoadingActivities } = useGetAppletActivitiesQuery(
    { params: { appletId: appletId as string } },
    { skip: !appletId },
  );

  const {
    execute: fetchAssignedActivities,
    isLoading: isLoadingAssignedActivities,
    value: fetchedAssignedActivities,
  } = useAsync(getAppletSubjectActivitiesApi, { retainValue: true });

  const flows: AssignedActivityFlow[] = useMemo(
    () => fetchedActivities?.appletDetail.activityFlows ?? [],
    [fetchedActivities],
  );
  const assignedFlows: AssignedActivityFlow[] = useMemo(
    () => fetchedAssignedActivities?.data?.result.activityFlows ?? [],
    [fetchedAssignedActivities],
  );
  const unassignedFlows: AssignedActivityFlow[] = useMemo(
    () =>
      enableActivityAssign
        ? flows.filter((activity) => !assignedFlows.some(({ id }) => id === activity.id))
        : [],
    [assignedFlows, enableActivityAssign, flows],
  );

  const activities: AssignedActivity[] = useMemo(
    () => fetchedActivities?.activitiesDetails ?? [],
    [fetchedActivities],
  );
  const assignedActivities: AssignedActivity[] = useMemo(
    () => fetchedAssignedActivities?.data?.result.activities ?? [],
    [fetchedAssignedActivities],
  );
  const unassignedActivities: AssignedActivity[] = useMemo(
    () =>
      enableActivityAssign
        ? activities.filter((activity) => !assignedActivities.some(({ id }) => id === activity.id))
        : [],
    [activities, assignedActivities, enableActivityAssign],
  );

  const selectedActivityOrFlow = useMemo(() => {
    if (!selectedActivityOrFlowId) return undefined;

    if (selectedActivityOrFlowId.activityId) {
      return (enableActivityAssign ? assignedActivities : activities).find(
        (activity) => activity.id === selectedActivityOrFlowId.activityId,
      );
    }

    if (selectedActivityOrFlowId.activityFlowId) {
      const flow = (enableActivityAssign ? assignedFlows : flows).find(
        (flow) => flow.id === selectedActivityOrFlowId.activityFlowId,
      );

      return flow ? hydrateActivityFlows([flow], activities)[0] : undefined;
    }

    return undefined;
  }, [
    activities,
    assignedActivities,
    assignedFlows,
    enableActivityAssign,
    flows,
    selectedActivityOrFlowId,
  ]);

  const {
    formatRow,
    getActivityById,
    actions: defaultActions,
    TakeNowModal,
    openTakeNowModal,
  } = useActivityGrid({
    dataTestId,
    activitiesData: { activities, total: activities.length },
    onClickExportData: useCallback((activityId: string) => {
      setSelectedActivityOrFlowId({ activityId });
      setShowExportPopup(true);
    }, []),
    onClickAssign: useCallback((activityId: string) => {
      setSelectedActivityOrFlowId({ activityId });
      setShowActivityAssign(true);
      Mixpanel.track({
        action: MixpanelEventType.StartAssignActivityOrFlow,
        [MixpanelProps.AppletId]: appletId,
        [MixpanelProps.ActivityId]: activityId,
        [MixpanelProps.EntityType]: 'activity',
        [MixpanelProps.Via]: 'Participant - Activities',
      });
    }, []),
    onClickUnassign: useCallback((activityId: string) => {
      setSelectedActivityOrFlowId({ activityId });
      setShowActivityUnassign(true);
    }, []),
  });

  const isLoadingSubject = subjectLoadingStatus === 'loading' || subjectLoadingStatus === 'idle';
  const isLoading = isLoadingActivities || isLoadingAssignedActivities || isLoadingSubject;
  const showContent = !isLoading || !!activities.length;

  useEffect(() => {
    if (!appletId || !subjectId) return;

    if (enableActivityAssign) {
      fetchAssignedActivities({ appletId, subjectId });
    }
  }, [appletId, enableActivityAssign, fetchAssignedActivities, subjectId]);

  const formatActivities = useCallback(
    (activities: AssignedActivity[]) =>
      activities.map((activity) => {
        const actions = {
          ...defaultActions,
          takeNow: ({ context }: MenuActionProps<ActivityActionProps>) => {
            const { activityId } = context || { activityId: '' };
            const activity = getActivityById(activityId);
            if (activity) {
              const options: OpenTakeNowModalOptions = {};

              if (subjectId && subject) {
                options.targetSubject = {
                  id: subjectId,
                  userId: subject.result.userId,
                  secretId: subject.result.secretUserId,
                  nickname: subject.result.nickname,
                  tag: subject.result.tag,
                  isTeamMember: subject.result.roles.some((role) =>
                    TEAM_MEMBER_ROLES.includes(role),
                  ),
                  roles: subject.result.roles,
                };
              }

              openTakeNowModal(activity, options);
            }
          },
        };

        return formatRow(activity, actions);
      }),
    [formatRow, defaultActions, getActivityById, openTakeNowModal, subject, subjectId],
  );

  const canAccessData = checkIfCanAccessData(roles);

  const handleClickActivity = (activityOrFlowId: ActivityOrFlowId) => {
    setSelectedActivityOrFlowId(activityOrFlowId);

    if (!hasEncryptionCheck) {
      setViewDataPopupVisible(true);

      return;
    }
    navigateToData(activityOrFlowId);
  };

  const onClickAssignFlow = (flowId: string) => {
    setSelectedActivityOrFlowId({ activityFlowId: flowId });
    setShowActivityAssign(true);
    Mixpanel.track({
      action: MixpanelEventType.StartAssignActivityOrFlow,
      [MixpanelProps.AppletId]: appletId,
      [MixpanelProps.ActivityFlowId]: flowId,
      [MixpanelProps.EntityType]: 'flow',
      [MixpanelProps.Via]: 'Participant - Activities',
    });
  };

  const navigateToData = (activityOrFlowId: ActivityOrFlowId) => {
    if (!subjectId || !appletId) return;

    navigate(
      generatePath(
        activityOrFlowId.activityId
          ? page.appletParticipantActivityDetailsDataSummary
          : page.appletParticipantActivityDetailsFlowDataSummary,
        {
          appletId,
          subjectId,
          ...activityOrFlowId,
        },
      ),
    );
  };

  const getClickHandler = () => {
    if (!subjectId || !appletId || !canAccessData) return undefined;

    return handleClickActivity;
  };

  return (
    <StyledFlexColumn sx={{ gap: 2.4, maxHeight: '100%' }}>
      {isLoading && <Spinner />}

      {appletId && subject && (
        <ParticipantActivitiesToolbar
          appletId={appletId}
          data-testid={dataTestId}
          onClickAssign={() => {
            setShowActivityAssign(true);
            Mixpanel.track({
              action: MixpanelEventType.StartAssignActivityOrFlow,
              [MixpanelProps.AppletId]: appletId,
              [MixpanelProps.Via]: 'Participant - Activities',
            });
          }}
          sx={{ p: 3.2, pb: 0 }}
        />
      )}

      {showContent && (
        <StyledFlexColumn sx={{ gap: 4.8, overflow: 'auto', p: 3.2 }}>
          {!!(enableActivityAssign ? assignedFlows : flows).length && (
            <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
              <ActivitiesSectionHeader
                title={t('flows')}
                count={(enableActivityAssign ? assignedFlows : flows).length}
              />

              <FlowGrid
                activities={activities}
                applet={appletData}
                data-testid={dataTestId}
                flows={enableActivityAssign ? assignedFlows : flows}
                subject={subject?.result}
                onClickItem={getClickHandler()}
                onClickAssign={onClickAssignFlow}
                onClickUnassign={(flowId) => {
                  setSelectedActivityOrFlowId({ activityFlowId: flowId });
                  setShowActivityUnassign(true);
                }}
              />
            </StyledFlexColumn>
          )}

          <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
            <ActivitiesSectionHeader
              title={t('activities')}
              count={(enableActivityAssign ? assignedActivities : activities).length}
            />

            <ActivityGrid
              rows={formatActivities(enableActivityAssign ? assignedActivities : activities)}
              TakeNowModal={TakeNowModal}
              data-testid={dataTestId}
              order="desc"
              orderBy=""
              onClickItem={getClickHandler()}
            />
          </StyledFlexColumn>

          {!!(unassignedFlows.length || unassignedActivities.length) && (
            <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
              <ActivitiesSectionHeader
                title={t('unassigned')}
                count={unassignedFlows.length + unassignedActivities.length}
              />

              <FlowGrid
                activities={activities}
                applet={appletData}
                data-testid={`${dataTestId}-unassigned`}
                flows={unassignedFlows}
                subject={subject?.result}
                onClickItem={getClickHandler()}
                onClickAssign={onClickAssignFlow}
              />

              <ActivityGrid
                rows={formatActivities(unassignedActivities)}
                TakeNowModal={TakeNowModal}
                data-testid={`${dataTestId}-unassigned`}
                order="desc"
                orderBy=""
                onClickItem={getClickHandler()}
              />
            </StyledFlexColumn>
          )}
        </StyledFlexColumn>
      )}

      {viewDataPopupVisible && selectedActivityOrFlowId && (
        <UnlockAppletPopup
          appletId={appletId || ''}
          popupVisible={viewDataPopupVisible}
          setPopupVisible={(value) => {
            setViewDataPopupVisible(value);
            setSelectedActivityOrFlowId(undefined);
          }}
          onSubmitHandler={() => navigateToData(selectedActivityOrFlowId)}
        />
      )}

      {appletData && (
        <ExportDataSetting
          isExportSettingsOpen={showExportPopup}
          onExportSettingsClose={() => setShowExportPopup(false)}
          onDataExportPopupClose={() => setSelectedActivityOrFlowId(undefined)}
          chosenAppletData={appletData ?? null}
          filters={{ activityId: selectedActivityOrFlowId?.activityId, targetSubjectId: subjectId }}
          isAppletSetting
        />
      )}

      <ActivityAssignDrawer
        appletId={appletId}
        activityId={selectedActivityOrFlowId?.activityId}
        activityFlowId={selectedActivityOrFlowId?.activityFlowId}
        open={showActivityAssign}
        respondentSubjectId={subject?.result.userId ? subject.result.id : undefined}
        targetSubjectId={subject?.result.tag === 'Team' ? undefined : subject?.result.id}
        onClose={(shouldRefetch?: boolean) => {
          setShowActivityAssign(false);
          if (shouldRefetch && appletId && subjectId) {
            fetchAssignedActivities({ appletId, subjectId });
          }
          setSelectedActivityOrFlowId(undefined);
        }}
      />

      <ActivityUnassignDrawer
        appletId={appletId}
        activityOrFlow={selectedActivityOrFlow}
        open={showActivityUnassign}
        onClose={(shouldRefetch?: boolean) => {
          setShowActivityUnassign(false);
          if (shouldRefetch && appletId && subjectId) {
            fetchAssignedActivities({ appletId, subjectId });
          }
          // Allow drawer to transition out before clearing activity/flow to prevent activity
          // header from rendering empty state before drawer closes
          setTimeout(() => setSelectedActivityOrFlowId(undefined), 300);
        }}
      />
    </StyledFlexColumn>
  );
};

export default Activities;
