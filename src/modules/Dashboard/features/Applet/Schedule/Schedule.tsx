import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { usePermissions } from 'shared/hooks';
import { applet, workspaces } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';
import { usePreparedEvents } from './Schedule.hooks';
import { checkIfHasAccessToSchedule } from './Schedule.utils';
import { ScheduleProvider } from './ScheduleProvider';

export const Schedule = () => {
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { data: workspaceRoles } = workspaces.useRolesData() ?? {};
  const { ownerId } = workspaces.useData() || {};
  const loadingStatus = users.useAllRespondentsStatus();
  const isLoading = loadingStatus === 'loading' || loadingStatus === 'idle';
  const { getAllWorkspaceRespondents, getRespondentDetails } = users.thunk;
  const preparedEvents = usePreparedEvents(appletData);
  const hasAccess = appletId ? checkIfHasAccessToSchedule(workspaceRoles?.[appletId]) : false;

  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    if (!appletId || !hasAccess) return;

    return dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId, shell: false },
      }),
    );
  });

  useEffect(() => {
    if (!appletId || !hasAccess) return;
    const { getEvents } = applets.thunk;
    dispatch(getEvents({ appletId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, dispatch, getRespondentDetails, hasAccess, ownerId]);

  if (isForbidden || !hasAccess) return noPermissionsComponent;

  return isLoading ? (
    <StyledBody>
      <Spinner />
    </StyledBody>
  ) : (
    <ScheduleProvider appletId={appletId} appletName={appletData?.displayName}>
      <StyledSchedule>
        <StyledLeftPanel>
          <Legend legendEvents={preparedEvents} />
        </StyledLeftPanel>

        <Calendar />
      </StyledSchedule>
    </ScheduleProvider>
  );
};
