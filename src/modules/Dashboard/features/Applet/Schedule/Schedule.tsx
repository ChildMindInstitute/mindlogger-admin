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

export const Schedule = () => {
  const dispatch = useAppDispatch();
  const { respondentId, appletId } = useParams();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { data: workspaceRoles } = workspaces.useRolesData() ?? {};
  const { ownerId } = workspaces.useData() || {};
  const loadingStatus = users.useAllRespondentsStatus();
  const isLoading = loadingStatus === 'loading' || loadingStatus === 'idle';
  const { getAllWorkspaceRespondents, getRespondentDetails } = users.thunk;
  const preparedEvents = usePreparedEvents(appletData);
  const hasAccess = checkIfHasAccessToSchedule(workspaceRoles?.[appletId!]);

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId },
      }),
    ),
  );

  useEffect(() => {
    if (!appletId || !hasAccess) return;
    const { getEvents } = applets.thunk;
    dispatch(getEvents({ appletId, respondentId }));

    if (!respondentId || !ownerId) return;
    dispatch(getRespondentDetails({ ownerId, appletId, respondentId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, respondentId, hasAccess, ownerId]);

  if (isForbidden || !hasAccess) return noPermissionsComponent;

  return isLoading ? (
    <StyledBody>
      <Spinner />
    </StyledBody>
  ) : (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend legendEvents={preparedEvents} appletName={appletData?.displayName || ''} appletId={appletId || ''} />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
