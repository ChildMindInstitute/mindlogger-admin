import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { getAppletActivitiesApi, getAppletApi } from 'api';
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
import { users } from 'modules/Dashboard/state';
import { Activity, ActivityFlow } from 'redux/modules';
import { StyledFlexColumn } from 'shared/styles';
import { page } from 'resources';

import { ParticipantActivitiesToolbar } from './ParticipantActivitiesToolbar';
import { UnlockAppletPopup } from '../../Respondents/Popups/UnlockAppletPopup';

const dataTestId = 'dashboard-applet-participant-activities';

export const Activities = () => {
  const { appletId, subjectId } = useParams();
  const { t } = useTranslation('app');
  const subjectLoadingStatus = users.useSubjectStatus();
  const subject = users.useSubject();
  const navigate = useNavigate();
  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>();

  // TODO M2-6223: Update these calls to include a `subject_id` param
  const {
    execute: getActivities,
    isLoading: isLoadingActivities,
    value: activitiesResponse,
    previousValue: previousActivitiesResponse,
  } = useAsync(getAppletActivitiesApi);
  const {
    execute: getFlows,
    isLoading: isLoadingFlows,
    value: flowResponse,
    previousValue: previousFlowResponse,
  } = useAsync(getAppletApi);
  const activities: Activity[] = useMemo(
    () => (activitiesResponse ?? previousActivitiesResponse)?.data?.result?.activitiesDetails ?? [],
    [activitiesResponse, previousActivitiesResponse],
  );
  const flows: ActivityFlow[] =
    (flowResponse ?? previousFlowResponse)?.data?.result?.activityFlows ?? [];
  const flowActivities: Activity[] =
    (flowResponse ?? previousFlowResponse)?.data?.result?.activities ?? [];

  const {
    formatRow,
    getActivityById,
    actions: defaultActions,
    TakeNowModal,
    openTakeNowModal,
  } = useActivityGrid(dataTestId, { result: activities, count: activities.length });

  const isLoadingSubject = subjectLoadingStatus === 'loading' || subjectLoadingStatus === 'idle';
  const isLoading = isLoadingActivities || isLoadingFlows || isLoadingSubject;
  const showContent =
    (isLoading && previousActivitiesResponse?.data?.result?.activitiesDetails?.length > 0) ||
    !isLoading;

  useEffect(() => {
    if (!appletId) return;

    getFlows({ appletId });
    getActivities({ params: { appletId } });
  }, [appletId, getActivities, getFlows]);

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
    [activities, formatRow],
  );

  const onClickItemHandler = (activityId: string) => {
    if (!subjectId || !appletId) return;
    setSelectedActivityId(activityId);

    if (!hasEncryptionCheck) {
      setViewDataPopupVisible(true);

      return;
    }
    navigateToData(activityId);
  };

  const navigateToData = (activityId?: string) => {
    if (!subjectId || !appletId || !activityId) return;
    navigate(
      generatePath(page.appletParticipantActivityDetailsDataSummary, {
        appletId,
        subjectId,
        activityId,
      }),
    );
  };

  return (
    <StyledFlexColumn sx={{ gap: 2.4, maxHeight: '100%' }}>
      {isLoading && <Spinner />}

      <ParticipantActivitiesToolbar
        appletId={appletId}
        data-testid={dataTestId}
        sx={{ px: 3.2, pt: 3.2 }}
      />

      {showContent && (
        <StyledFlexColumn sx={{ gap: 4.8, overflow: 'auto', p: 3.2, pt: 0 }}>
          {!!flows?.length && (
            <StyledFlexColumn component="section" sx={{ gap: 1.6 }}>
              <ActivitiesSectionHeader title={t('flows')} count={flows?.length ?? 0} />

              <FlowGrid
                appletId={appletId}
                activities={flowActivities}
                flows={flows}
                subject={subject?.result}
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
              onClickItem={onClickItemHandler}
            />
            {viewDataPopupVisible && (
              <UnlockAppletPopup
                appletId={appletId || ''}
                popupVisible={viewDataPopupVisible}
                setPopupVisible={(value) => {
                  setViewDataPopupVisible(value);
                  setSelectedActivityId(undefined);
                }}
                onSubmitHandler={() => navigateToData(selectedActivityId)}
              />
            )}
          </StyledFlexColumn>
        </StyledFlexColumn>
      )}
    </StyledFlexColumn>
  );
};

export default Activities;
