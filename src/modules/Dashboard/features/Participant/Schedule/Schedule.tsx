import { useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import { Calendar } from 'modules/Dashboard/features/Applet/Schedule/Calendar';
import { Legend } from 'modules/Dashboard/features/Applet/Schedule/Legend';
import { usePreparedEvents } from 'modules/Dashboard/features/Applet/Schedule/Schedule.hooks';
import { applet, workspaces } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { Spinner } from 'shared/components';
import { theme, variables } from 'shared/styles';
import { useAppDispatch } from 'redux/store';
import { Participant } from 'modules/Dashboard/types';
import { usePermissions } from 'shared/hooks';
import { checkIfHasAccessToSchedule } from 'modules/Dashboard/features/Applet/Schedule/Schedule.utils';
import { ScheduleProvider } from 'modules/Dashboard/features/Applet/Schedule/ScheduleProvider';
import { getRespondentName } from 'shared/utils';

export const ParticipantSchedule = () => {
  const { appletId } = useParams();
  const { getAllWorkspaceRespondents } = users.thunk;
  const { getEvents } = applets.thunk;
  const { ownerId } = workspaces.useData() || {};
  const { data: workspaceRoles } = workspaces.useRolesData() ?? {};
  const { result: appletData } = applet.useAppletData() ?? {};
  const { result: respondentsData } = users.useAllRespondentsData() || {};
  const { result: subjectData } = users.useSubject() ?? {};

  const allRespondentsLoadingStatus = users.useAllRespondentsStatus();
  const dispatch = useAppDispatch();
  const preparedEvents = usePreparedEvents(appletData);
  const subjectLoadingStatus = users.useSubjectStatus();
  const isLoading =
    allRespondentsLoadingStatus === 'idle' ||
    allRespondentsLoadingStatus === 'loading' ||
    subjectLoadingStatus === 'idle' ||
    subjectLoadingStatus === 'loading';

  const selectedRespondent = useMemo(
    () =>
      respondentsData?.find(({ secretIds }) =>
        subjectData ? secretIds.includes(subjectData?.secretUserId) : false,
      ) ?? ({} as Participant),
    [respondentsData, subjectData],
  );

  const { details, id: userId } = selectedRespondent ?? {};
  const respondentDetails = details?.[0] ?? {};
  const { respondentSecretId, hasIndividualSchedule, respondentNickname } = respondentDetails;
  const hasAccess = appletId ? checkIfHasAccessToSchedule(workspaceRoles?.[appletId]) : false;
  const respondentName = getRespondentName(respondentSecretId || '', respondentNickname);

  useEffect(() => {
    if (!appletId || !ownerId || !hasAccess) return;

    dispatch(getAllWorkspaceRespondents({ params: { ownerId, appletId, shell: false } }));
  }, [appletId, dispatch, getAllWorkspaceRespondents, hasAccess, ownerId]);

  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    if (!appletId || !ownerId || !hasAccess) return;

    return dispatch(getAllWorkspaceRespondents({ params: { ownerId, appletId, shell: false } }));
  });

  useEffect(() => {
    if (!appletId || !hasAccess) return;

    const shouldFetchUserEvents = hasIndividualSchedule && !!userId;

    dispatch(
      getEvents({
        appletId,
        respondentId: shouldFetchUserEvents ? userId : undefined,
      }),
    );

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, dispatch, getEvents, hasAccess, hasIndividualSchedule, userId]);

  if (isForbidden || !hasAccess) return noPermissionsComponent;

  return (
    <Box
      data-testid="participant-schedule"
      sx={{ display: 'flex', height: '100%', position: 'relative' }}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <ScheduleProvider
          appletId={appletId ?? 'Unknown applet ID'}
          appletName={appletData?.displayName ?? 'Unknown applet'}
          canCreateIndividualSchedule={!!userId && !selectedRespondent?.isAnonymousRespondent}
          hasIndividualSchedule={hasIndividualSchedule}
          showEditDefaultConfirmation={!hasIndividualSchedule}
          userId={userId ?? undefined}
          participantName={respondentName}
          participantSecretId={respondentSecretId}
        >
          <Legend
            legendEvents={preparedEvents}
            showScheduleToggle={!selectedRespondent?.isAnonymousRespondent}
            sx={{
              borderRight: `${theme.spacing(0.1)} solid ${variables.palette.surface_variant}`,
              width: theme.spacing(32),
            }}
          />
          <Calendar />
        </ScheduleProvider>
      )}
    </Box>
  );
};

export default ParticipantSchedule;
