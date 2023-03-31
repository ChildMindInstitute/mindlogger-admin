import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { LinkedTabs, Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';
import { users, applets } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

import { useAppletTabs } from './Applet.hooks';

export const Applet = () => {
  const dispatch = useAppDispatch();
  const usersMetaStatus = users.useRespondentsMetaStatus();

  const isLoading = usersMetaStatus === 'loading' || usersMetaStatus === 'idle';

  const appletTabs = useAppletTabs();
  const { id: appletId } = useParams();

  useEffect(() => {
    if (!appletId) return;

    const { getApplet, getEvents } = applets.thunk;
    dispatch(getApplet({ appletId }));
    dispatch(getEvents({ appletId }));
  }, [appletId]);

  return <StyledBody>{isLoading ? <Spinner /> : <LinkedTabs tabs={appletTabs} />}</StyledBody>;
};
