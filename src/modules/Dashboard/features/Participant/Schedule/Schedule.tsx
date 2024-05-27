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
import { Respondent } from 'modules/Dashboard/types';

export const ParticipantSchedule = () => {
  const { appletId } = useParams();
  const { getAllWorkspaceRespondents } = users.thunk;
  const { getEvents } = applets.thunk;
  const { ownerId } = workspaces.useData() || {};
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
      ) ?? ({} as Respondent),
    [respondentsData, subjectData],
  );
  const { details, id: userId } = selectedRespondent ?? {};
  const hasIndividualSchedule = details ? details[0].hasIndividualSchedule : false;

  useEffect(() => {
    if (!appletId || !ownerId) return;

    dispatch(getAllWorkspaceRespondents({ params: { ownerId, appletId, shell: false } }));
  }, [appletId, dispatch, getAllWorkspaceRespondents, ownerId]);

  useEffect(() => {
    if (!appletId) return;

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
  }, [appletId, dispatch, getEvents, hasIndividualSchedule, userId]);

  return (
    <Box
      data-testid="participant-schedule"
      sx={{ display: 'flex', height: '100%', position: 'relative' }}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Legend
            appletId={appletId ?? 'Unknown applet ID'}
            appletName={appletData?.displayName ?? 'Unknown applet'}
            canCreateIndividualSchedule={!!userId}
            hasIndividualSchedule={hasIndividualSchedule}
            legendEvents={preparedEvents}
            showScheduleToggle
            userId={userId ?? undefined}
            sx={{
              borderRight: `${theme.spacing(0.1)} solid ${variables.palette.surface_variant}`,
              width: theme.spacing(32),
            }}
          />
          <Calendar userId={hasIndividualSchedule && userId ? userId : undefined} />
        </>
      )}
    </Box>
  );
};

export default ParticipantSchedule;
