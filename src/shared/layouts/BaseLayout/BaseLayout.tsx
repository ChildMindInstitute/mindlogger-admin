import { useEffect } from 'react';

import { Outlet, useParams } from 'react-router-dom';

import { workspaces, auth, alerts } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Footer } from 'shared/components';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { useAlertsWebsocket } from 'shared/hooks';

import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';
import { LeftBar, TopBar } from './components';

export const BaseLayout = () => {
  const { appletId } = useParams();
  const dispatch = useAppDispatch();

  const isAuthorized = auth.useAuthorized();
  const { ownerId } = workspaces.useData() || {};

  useAlertsWebsocket();

  useEffect(() => {
    if (!isAuthorized) return;

    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
  }, [isAuthorized]);

  useEffect(() => {
    if (!ownerId) return;
    const { getWorkspaceRoles } = workspaces.thunk;
    dispatch(
      getWorkspaceRoles({
        ownerId,
      }),
    );
  }, [dispatch, ownerId, appletId]);

  return (
    <StyledBaseLayout>
      {isAuthorized && <LeftBar />}
      <StyledCol isAuthorized={isAuthorized}>
        <TopBar />
        <Outlet />
        <Footer />
      </StyledCol>
    </StyledBaseLayout>
  );
};
