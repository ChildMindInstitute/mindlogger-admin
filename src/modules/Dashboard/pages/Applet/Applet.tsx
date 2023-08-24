import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { LinkedTabs } from 'shared/components';
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
  const removeAppletData = useRemoveAppletData();

  const hiddenHeader = location.pathname.includes('dataviz');
  const { getApplet } = applet.thunk;

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    appletId ? dispatch(getApplet({ appletId })) : undefined,
  );

  useEffect(() => removeAppletData, []);

  if (isForbidden) return noPermissionsComponent;

  return (
    <StyledBody>
      {appletData && <LinkedTabs hiddenHeader={hiddenHeader} tabs={appletTabs} />}
    </StyledBody>
  );
};
