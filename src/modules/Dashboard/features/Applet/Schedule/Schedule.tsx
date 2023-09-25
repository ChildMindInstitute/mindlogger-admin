import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useBreadcrumbs, usePermissions } from 'shared/hooks';
import { applet, workspaces } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';
import { usePreparedEvents } from './Schedule.hooks';

export const Schedule = () => {
  const dispatch = useAppDispatch();
  const { respondentId, appletId } = useParams();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { ownerId } = workspaces.useData() || {};
  const loadingStatus = users.useAllRespondentsStatus();
  const isLoading = loadingStatus === 'loading' || loadingStatus === 'idle';
  const { getAllWorkspaceRespondents } = users.thunk;
  const preparedEvents = usePreparedEvents(appletData);

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId },
      }),
    ),
  );

  useBreadcrumbs();

  useEffect(() => {
    if (!appletId) return;

    const { getEvents } = applets.thunk;

    dispatch(getEvents({ appletId, respondentId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, respondentId]);

  if (isForbidden) return noPermissionsComponent;

  return isLoading ? (
    <StyledBody>
      <Spinner />
    </StyledBody>
  ) : (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend
          legendEvents={preparedEvents}
          appletName={appletData?.displayName || ''}
          appletId={appletId || ''}
        />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
