import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { LinkedTabs, Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';
import { users, applets } from 'modules/Dashboard/state';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';

import { useAppletTabs } from './Applet.hooks';

export const Applet = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userMetaStatus = users.useUserMetaStatus();
  const managerMetaStatus = users.useManagerMetaStatus();
  const isLoading =
    userMetaStatus === 'loading' ||
    userMetaStatus === 'idle' ||
    managerMetaStatus === 'loading' ||
    managerMetaStatus === 'idle';
  const appletTabs = useAppletTabs();
  const { id: appletId } = useParams();

  const hiddenHeader = location.pathname.includes('data');

  useEffect(() => {
    if (!appletId) return;

    const { getApplet } = applet.thunk;
    const { getEvents } = applets.thunk;
    dispatch(getApplet({ appletId }));
    dispatch(getEvents({ appletId }));
  }, [appletId]);

  return (
    <StyledBody>
      {isLoading ? <Spinner /> : <LinkedTabs hiddenHeader={hiddenHeader} tabs={appletTabs} />}
    </StyledBody>
  );
};
