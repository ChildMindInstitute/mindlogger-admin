import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Tooltip } from '@mui/material';

import { LinkedTabs, Spinner, Svg } from 'shared/components';
import { StyledBody, StyledHeadlineLarge, theme } from 'shared/styles';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { usePermissions, useRemoveAppletData } from 'shared/hooks';
import { palette } from 'shared/styles/variables/palette';

import { useMultiInformantAppletTabs } from './Applet.hooks';

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
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={theme.spacing(1.6)}
            margin={`${theme.spacing(1.2)} ${theme.spacing(3.4)}`}
          >
            {appletData.image && (
              <img src={appletData.image} width={48} style={{ borderRadius: '4px' }} />
            )}
            <StyledHeadlineLarge>{appletData.displayName}</StyledHeadlineLarge>
            <Tooltip
              title={appletData.description as string}
              disableFocusListener
              disableTouchListener
              arrow
              placement="right-end"
            >
              <Box
                style={{ cursor: 'pointer' }}
                display="flex"
                alignItems="center"
                paddingX={theme.spacing(0.8)}
              >
                <Svg id="more-info-outlined" fill={palette.outline_variant} />
              </Box>
            </Tooltip>
          </Box>
          <LinkedTabs hiddenHeader={hiddenHeader} tabs={appletTabs} isCentered={false} />
        </>
      )}
    </StyledBody>
  );
};
