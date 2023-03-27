import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { LinkedTabs, Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';
import { users, applets } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

import { useAppletTabs } from './Applet.hooks';

export const Applet = () => {
  const dispatch = useAppDispatch();
  const userMetaStatus = users.useUserMetaStatus();
  const managerMetaStatus = users.useManagerMetaStatus();
  const isLoading =
    userMetaStatus === 'loading' ||
    userMetaStatus === 'idle' ||
    managerMetaStatus === 'loading' ||
    managerMetaStatus === 'idle';
  const appletTabs = useAppletTabs();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const appletId = id;
    const { getApplet, getEvents } = applets.thunk;
    dispatch(getApplet({ appletId }));
    dispatch(getEvents({ appletId }));
  }, [id]);

  return <StyledBody>{isLoading ? <Spinner /> : <LinkedTabs tabs={appletTabs} />}</StyledBody>;
};
