import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';

import { LinkedTabs, Spinner, Svg } from 'shared/components';
import { StyledBody, StyledFlexTopCenter, StyledHeadlineLarge, theme } from 'shared/styles';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { usePermissions, useRemoveAppletData } from 'shared/hooks';
import { palette } from 'shared/styles/variables/palette';

import { useMultiInformantAppletTabs } from './Applet.hooks';
import { StyledAppletLogo } from './Applet.styles';

export const AppletMultiInformant = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const appletTabs = useMultiInformantAppletTabs();
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
        <>
          <StyledFlexTopCenter
            sx={{
              m: `${theme.spacing(1.2, 3.4)}`,
              gap: theme.spacing(1.6),
            }}
          >
            {!!appletData.image && <StyledAppletLogo src={appletData.image} />}
            <StyledHeadlineLarge>{appletData.displayName}</StyledHeadlineLarge>
            {!!appletData?.description && (
              <Tooltip
                title={appletData.description as string}
                disableFocusListener
                disableTouchListener
                arrow
                placement="right-end"
              >
                <StyledFlexTopCenter sx={{ cursor: 'pointer', paddingX: theme.spacing(0.8) }}>
                  <Svg id="more-info-outlined" fill={palette.outline_variant} />
                </StyledFlexTopCenter>
              </Tooltip>
            )}
          </StyledFlexTopCenter>
          <LinkedTabs hiddenHeader={hiddenHeader} tabs={appletTabs} isCentered={false} />
        </>
      )}
    </StyledBody>
  );
};
