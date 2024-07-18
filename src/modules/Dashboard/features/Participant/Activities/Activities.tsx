import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { getAppletActivitiesApi } from 'api';
import { useAsync, useEncryptionStorage } from 'shared/hooks';
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
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [selectedActivityOrFlowId, setSelectedActivityOrFlowId] = useState<ActivityOrFlowId>();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  // TODO M2-6223: Update this call to include a `subject_id` param
  const {
    execute,
    isLoading: isLoadingActivities,
    value,
    previousValue,
  } = useAsync(getAppletActivitiesApi);
  const flows: ActivityFlow[] =
    (value ?? previousValue)?.data?.result?.appletDetail?.activityFlows ?? [];
  const activities: Activity[] = useMemo(
    () => (value ?? previousValue)?.data?.result?.activitiesDetails ?? [],
    [value, previousValue],
  );

  const {
    formatRow,
    getActivityById,
    actions: defaultActions,
    TakeNowModal,
    openTakeNowModal,
  } = useActivityGrid({
    dataTestId,
    activitiesData: { result: activities, count: activities.length },
    onClickExportData: useCallback((activityId) => {
      setActivityId(activityId);
      setShowExportPopup(true);
    }, []),
    onClickAssign: useCallback((activityId) => {
      setActivityId(activityId);
      setShowActivityAssign(true);
    }, []),
  });

  const isLoadingSubject = subjectLoadingStatus === 'loading' || subjectLoadingStatus === 'idle';
  const isLoading = isLoadingActivities || isLoadingSubject;
  const showContent =
    (isLoading && previousValue?.data?.result?.activitiesDetails?.length > 0) || !isLoading;

  useEffect(() => {
    if (!appletId) return;

    execute({ params: { appletId } });
  }, [appletId, execute]);

  const formattedActivities = useMemo(
    () =>
      (activities ?? []).map((activity) => {
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
        respondentId={subject?.result.userId ?? undefined}
        targetSubjectId={subject?.result.userId ? undefined : subject?.result.id}
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
