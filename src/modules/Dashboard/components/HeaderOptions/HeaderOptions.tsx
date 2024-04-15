import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { Mixpanel } from 'shared/utils';

export const HeaderOptions = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const isSettingsSelected = location.pathname.includes('settings');

  const handleOpenExport = () => {
    setIsExportOpen(true);
    Mixpanel.track('Export Data click');
  };

  const handleCloseExport = () => {
    setIsExportOpen(false);
  };

  return (
    <StyledFlexTopCenter sx={{ gap: 1 }}>
      <Button
        data-testid="header-option-export-button"
        onClick={handleOpenExport}
        startIcon={<Svg id="export" width={18} height={18} />}
        sx={{ color: variables.palette.on_surface_variant }}
      >
        {t('export')}
      </Button>

      <IconButton
        component={Link}
        sx={{ width: '4.8rem', height: '4.8rem' }}
        to={generatePath(page.appletSettings, { appletId })}
        data-testid="header-option-settings-link"
      >
        <Svg id="settings" fill={isSettingsSelected ? variables.palette.primary : ''} />
      </IconButton>

      <ExportDataSetting
        isExportSettingsOpen={isExportOpen}
        onExportSettingsClose={handleCloseExport}
      />
    </StyledFlexTopCenter>
  );
};
