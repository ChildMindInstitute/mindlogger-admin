import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { applet, workspaces } from 'shared/state';
import { applets } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { usePermissions } from 'shared/hooks';

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
  const preparedEvents = usePreparedEvents(appletData);
  const hasAccess = appletId ? checkIfHasAccessToSchedule(workspaceRoles?.[appletId]) : false;

  const { noPermissionsComponent } = usePermissions(() => undefined);

  useEffect(() => {
    if (!appletId || !hasAccess) return;
    const { getEvents } = applets.thunk;
    dispatch(getEvents({ appletId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, dispatch, hasAccess, ownerId]);

  if (!hasAccess) return noPermissionsComponent;

  return (
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
