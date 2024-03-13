import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { LinkedTabs, Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { usePermissions, useRemoveAppletData } from 'shared/hooks';

import { useAppletTabs } from './Applet.hooks';

export const Applet = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const appletTabs = useAppletTabs();
  const { appletId } = useParams();

  const { result: appletData } = applet.useAppletData() ?? {};
  const appletLoadingStatus = applet.useResponseStatus();
  const removeAppletData = useRemoveAppletData();

  const hiddenHeader = location.pathname.includes('dataviz');
  const { getApplet } = applet.thunk;

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    appletId ? dispatch(getApplet({ appletId })) : undefined,
  );

  useEffect(() => removeAppletData, []);

  if (isForbidden) return noPermissionsComponent;

  const isLoading = appletLoadingStatus === 'loading' || appletLoadingStatus === 'idle';

  return (
    <StyledBody>
      {isLoading && <Spinner />}
      {appletData && (
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={appletTabs} isCentered={false} />
      )}
    </StyledBody>
  );
};
