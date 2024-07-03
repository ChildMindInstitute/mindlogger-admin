import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { Mixpanel, checkIfCanAccessData, checkIfCanEdit } from 'shared/utils';
import { workspaces } from 'shared/state';

export const HeaderOptions = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const isSettingsSelected = location.pathname.includes('settings');
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  const handleOpenExport = () => {
    setIsExportOpen(true);
    Mixpanel.track('Export Data click');
  };

  const handleCloseExport = () => {
    setIsExportOpen(false);
  };

  const canAccessData = checkIfCanAccessData(roles);
  const canEdit = checkIfCanEdit(roles);

  return canEdit || canAccessData ? (
    <StyledFlexTopCenter sx={{ gap: 1, ml: 'auto' }}>
      {canAccessData && (
        <Button
          data-testid="header-option-export-button"
          onClick={handleOpenExport}
          startIcon={<Svg id="export" width={18} height={18} />}
          sx={{ color: variables.palette.on_surface_variant }}
        >
          {t('export')}
        </Button>
      )}

      {canEdit && (
        <IconButton
          component={Link}
          sx={{ width: '4.8rem', height: '4.8rem' }}
          to={generatePath(page.appletSettings, { appletId })}
          data-testid="header-option-settings-link"
        >
          <Svg id="settings" fill={isSettingsSelected ? variables.palette.primary : ''} />
        </IconButton>
      )}

      <ExportDataSetting
        isExportSettingsOpen={isExportOpen}
        onExportSettingsClose={handleCloseExport}
      />
    </StyledFlexTopCenter>
  ) : null;
};
