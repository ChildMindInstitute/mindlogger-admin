import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { getAppletActivitiesApi, getAppletSubjectActivitiesApi } from 'api';
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
import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { users } from 'modules/Dashboard/state';
import { Activity, ActivityFlow } from 'redux/modules';
import { applet } from 'shared/state/Applet';
import { StyledFlexColumn } from 'shared/styles';
import { page } from 'resources';
import { workspaces } from 'shared/state';
import { checkIfCanAccessData } from 'shared/utils';
import { ActivityAssignDrawer } from 'modules/Dashboard/components';

import { ActivityOrFlowId } from './Activities.types';
import { UnlockAppletPopup } from '../../Respondents/Popups/UnlockAppletPopup';
import { ParticipantActivitiesToolbar } from './ParticipantActivitiesToolbar';

const dataTestId = 'dashboard-applet-participant-activities';

export const Activities = () => {
  const { result: appletData } = applet.useAppletData() ?? {};
  const { appletId, subjectId } = useParams();
  const { t } = useTranslation('app');
  const subjectLoadingStatus = users.useSubjectStatus();
  const subject = users.useSubject();
  const navigate = useNavigate();
  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');
  const [activityId, setActivityId] = useState<string>();
  const [flowId, setFlowId] = useState<string>();
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

  // TODO: Remove use of getAppletActivitiesApi once enableActivityAssign feature flag is removed
  // https://mindlogger.atlassian.net/browse/M2-6518
  const {
    execute: fetchActivities,
    isLoading: isLoadingActivities,
    value: fetchedActivities,
    previousValue: previousActivities,
  } = useAsync(getAppletActivitiesApi);
  const {
    execute: fetchAssignedActivities,
    isLoading: isLoadingAssignedActivities,
    value: assignedActivities,
    previousValue: previousAssignedActivities,
  } = useAsync(getAppletSubjectActivitiesApi);

  const flows: ActivityFlow[] = useMemo(() => {
    if (enableActivityAssign) {
      return (assignedActivities ?? previousAssignedActivities)?.data?.result.activityFlows ?? [];
    }

    return (fetchedActivities ?? previousActivities)?.data?.result.appletDetail.activityFlows ?? [];
  }, [
    assignedActivities,
    enableActivityAssign,
    fetchedActivities,
    previousActivities,
    previousAssignedActivities,
  ]);

  const activities: Activity[] = useMemo(() => {
    if (enableActivityAssign) {
      return (assignedActivities ?? previousAssignedActivities)?.data?.result.activities ?? [];
    }

    return (fetchedActivities ?? previousActivities)?.data?.result.activitiesDetails ?? [];
  }, [
    assignedActivities,
    enableActivityAssign,
    fetchedActivities,
    previousActivities,
    previousAssignedActivities,
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
    } else {
      fetchActivities({ params: { appletId } });
    }
  }, [appletId, enableActivityAssign, fetchActivities, fetchAssignedActivities, subjectId]);

  const formattedActivities = useMemo(
    () =>
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
                  isTeamMember: subject.result.tag === 'Team',
                };
              }

              openTakeNowModal(activity, options);
            }
          },
        };

        return formatRow(activity, actions);
      }),
    [activities, formatRow, defaultActions, getActivityById, openTakeNowModal, subject, subjectId],
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
          onClickAssign={() => setShowActivityAssign(true)}
          sx={{ p: 3.2, pb: 0 }}
        />
      )}

      {showContent && (
        <StyledFlexColumn sx={{ gap: 4.8, overflow: 'auto', p: 3.2 }}>
          {!!flows?.length && (
            <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
              <ActivitiesSectionHeader title={t('flows')} count={flows?.length ?? 0} />

              <FlowGrid
                activities={activities}
                applet={appletData}
                data-testid={dataTestId}
                flows={flows}
                subject={subject?.result}
                onClickItem={getClickHandler()}
                onClickAssign={(flowId) => {
                  setFlowId(flowId);
                  setShowActivityAssign(true);
                }}
                onClickUnassign={(flowId) => {
                  setSelectedActivityOrFlowId({ activityFlowId: flowId });
                  setShowActivityUnassign(true);
                }}
              />
            </StyledFlexColumn>
          )}

          <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
            <ActivitiesSectionHeader title={t('activities')} count={activities?.length ?? 0} />

            <ActivityGrid
              rows={formattedActivities}
              TakeNowModal={TakeNowModal}
              data-testid={dataTestId}
              order="desc"
              orderBy=""
              onClickItem={getClickHandler()}
            />
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
          </StyledFlexColumn>
        </StyledFlexColumn>
      )}

      {showExportPopup && (
        <DataExportPopup
          chosenAppletData={appletData ?? null}
          filters={{ activityId, targetSubjectId: subjectId }}
          isAppletSetting
          popupVisible={showExportPopup}
          setPopupVisible={() => {
            setShowExportPopup(false);
            setActivityId(undefined);
          }}
        />
      )}

      <ActivityAssignDrawer
        appletId={appletId}
        activityId={activityId}
        activityFlowId={flowId}
        open={showActivityAssign}
        respondentSubjectId={subject?.result.userId ? subject.result.id : undefined}
        targetSubjectId={subject?.result.tag === 'Team' ? undefined : subject?.result.id}
        onClose={() => {
          setShowActivityAssign(false);
          setActivityId(undefined);
          setFlowId(undefined);
        }}
      />
    </StyledFlexColumn>
  );
};

export default Activities;
