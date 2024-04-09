import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledTitleMedium, theme, variables } from 'shared/styles';
import { Mixpanel } from 'shared/utils';

export const HeaderOptions = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const isSettingsSelected = location.pathname.includes('settings');

  return (
    <Box sx={{ display: 'flex', gap: theme.spacing(1), placeItems: 'baseline' }}>
      <Button
        data-testid="header-option-export-button"
        sx={{ color: variables.palette.on_surface_variant, gap: theme.spacing(1) }}
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
        data-testid="header-option-settings-link"
        to={generatePath(page.appletSettings, { appletId })}
      >
        <Svg id="settings" fill={isSettingsSelected ? variables.palette.primary : ''} />
      </Link>

      <ExportDataSetting
        isExportSettingsOpen={isExportOpen}
        onExportSettingsClose={() => {
          setIsExportOpen(false);
        }}
      />
    </Box>
  );
};
