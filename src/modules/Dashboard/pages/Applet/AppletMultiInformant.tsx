import { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';

import { HeaderOptions } from 'modules/Dashboard/components/HeaderOptions';
import { LinkedTabs, Spinner, Svg } from 'shared/components';
import {
  StyledBody,
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledLogo,
  theme,
} from 'shared/styles';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { usePermissions } from 'shared/hooks';
import { palette } from 'shared/styles/variables/palette';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledPanel } from 'shared/components/Tabs/TabPanel/TabPanel.style';

import { useMultiInformantAppletTabs } from './Applet.hooks';

export const AppletMultiInformant = () => {
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const location = useLocation();

  const appletTabs = useMultiInformantAppletTabs();
  const { appletId } = useParams();

  const { result: appletData } = applet.useAppletData() ?? {};
  const appletLoadingStatus = applet.useResponseStatus();

  const hiddenHeader = location.pathname.includes('dataviz');
  const { getApplet } = applet.thunk;

  const { isForbidden, noPermissionsComponent } = usePermissions(
    () => (appletId ? dispatch(getApplet({ appletId })) : undefined),
    // Refetch applet data when appletId changes
    [appletId],
  );

  if (isForbidden) return noPermissionsComponent;

  const isLoading = appletLoadingStatus === 'loading' || appletLoadingStatus === 'idle';

  const isTopLevelTab = appletTabs.map((tabConfig) => tabConfig.path).includes(location.pathname);

  return (
    <StyledBody>
      {isLoading && <Spinner />}
      {appletData && (
        <>
          {!hiddenHeader && (
            <StyledFlexSpaceBetween
              gap={theme.spacing(1.6)}
              margin={`${theme.spacing(1.2)} ${theme.spacing(3.4)}`}
            >
              <StyledFlexTopCenter gap={theme.spacing(1.6)}>
                {!!appletData.image && <StyledLogo src={appletData.image} />}
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

              <HeaderOptions />
            </StyledFlexSpaceBetween>
          )}

          <LinkedTabs
            panelProps={{ sx: { padding: 0 } }}
            deepPathCompare
            animateTabIndicator={false}
            defaultToFirstTab={false}
            hiddenHeader={hiddenHeader}
            isCentered={false}
            tabs={appletTabs}
          />

          {/*
            The main `<Outlet />` for this page lives in LinkedTabs above. The outlet appears when
            the current url matches the path config described in useMultiInformantAppletTabs.
            This is an issue for routes like /settings and /add-user which are not top-level tabs.

            Use of this extra `<Outlet />` is a temporary workaround for those routes. Both /settings
            and /add-user are becoming modals that will NOT change the url. When that happens, we
            should remove this.

            See:
              - https://mindlogger.atlassian.net/browse/M2-5987
              - https://mindlogger.atlassian.net/browse/M2-5436
          */}
          {!isTopLevelTab && (
            <StyledPanel hiddenHeader={hiddenHeader}>
              <Outlet />
            </StyledPanel>
          )}

          <ExportDataSetting
            isExportSettingsOpen={isExportOpen}
            onExportSettingsClose={() => {
              setIsExportOpen(false);
            }}
          />
        </>
      )}
    </StyledBody>
  );
};
