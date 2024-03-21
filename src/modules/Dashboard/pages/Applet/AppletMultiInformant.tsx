import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { Button, Tooltip } from '@mui/material';

import { LinkedTabs, Spinner, Svg } from 'shared/components';
import {
  StyledBody,
  StyledFlexSpaceBetween,
  StyledFlexTopBaseline,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { usePermissions, useRemoveAppletData } from 'shared/hooks';
import { palette } from 'shared/styles/variables/palette';
import { page } from 'resources';
import { Mixpanel } from 'shared/utils';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import DashboardAppletSettings from 'modules/Dashboard/features/Applet/DashboardAppletSettings';
import { StyledPanel } from 'shared/components/Tabs/TabPanel/TabPanel.style';

import { useMultiInformantAppletTabs } from './Applet.hooks';
import { StyledAppletLogo } from './Applet.styles';

export const AppletMultiInformant = () => {
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const { t } = useTranslation('app');

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
  const isSettingsSelected = location.pathname.includes('settings');

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

              <StyledFlexTopBaseline gap={theme.spacing(1)}>
                <Button
                  sx={{
                    gap: theme.spacing(1),
                    color: variables.palette.on_surface_variant,
                  }}
                  onClick={() => {
                    setIsExportOpen(true);
                    Mixpanel.track('Export Data click');
                  }}
                >
                  <Svg id="export" width={24} height={24} />
                  <StyledTitleMedium as="span" sx={{ color: variables.palette.on_surface_variant }}>
                    {t('export')}
                  </StyledTitleMedium>
                </Button>
                <Link
                  data-testid="dashboard-tab-settings"
                  to={generatePath(page.appletSettings, {
                    appletId,
                  })}
                >
                  <Svg id="settings" fill={isSettingsSelected ? variables.palette.primary : ''} />
                </Link>
              </StyledFlexTopBaseline>
            </StyledFlexSpaceBetween>
          )}

          <LinkedTabs
            animateTabIndicator={false}
            defaultToFirstTab={false}
            hiddenHeader={hiddenHeader}
            isCentered={false}
            tabs={appletTabs}
          />

          {isSettingsSelected && (
            <StyledPanel hiddenHeader={hiddenHeader}>
              <DashboardAppletSettings />
            </StyledPanel>
          )}
        </>
      )}
      <ExportDataSetting
        isExportSettingsOpen={isExportOpen}
        onExportSettingsClose={() => {
          setIsExportOpen(false);
        }}
      />
    </StyledBody>
  );
};
