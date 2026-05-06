import { useRef, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { Menu, Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { Mixpanel, checkIfCanAccessData, checkIfCanEdit, MixpanelEventType } from 'shared/utils';
import { workspaces } from 'shared/state';

export const HeaderOptions = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const isSettingsSelected = location.pathname.includes('settings');
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenExportMenu = () => {
    setShowExportMenu(true);
  };

  const handleOpenAuditLogs = () => {
    // TODO: Implement view audit logs
  }

  const handleOpenResponseData = () => {
    setIsExportOpen(true);
    Mixpanel.track({ action: MixpanelEventType.ExportDataClick });
  }

  const handleCloseExport = () => {
    setIsExportOpen(false);
  }

  const canAccessData = checkIfCanAccessData(roles);
  const canEdit = checkIfCanEdit(roles);

  const getExportActions = () => {
    return [
      {
        icon: <Svg id="response-data" />,
        action: handleOpenResponseData,
        title: t('exportResponseData'),
        'data-testid': 'header-option-response-data-button',
      },
      {
        icon: <Svg id="audit-logs" />,
        action: handleOpenAuditLogs,
        title: t('exportAuditLogs'),
        'data-testid': 'header-option-audit-logs-button',
      },
    ];
  }

  return canEdit || canAccessData ? (
    <StyledFlexTopCenter sx={{ gap: 1, ml: 'auto' }}>
      {canAccessData && (
        <Button
          ref={exportButtonRef}
          data-testid="header-option-export-button"
          onClick={handleOpenExportMenu}
          startIcon={<Svg id="export" width={18} height={18} />}
          sx={{ color: variables.palette.on_surface_variant }}
        >
          {t('export')}
        </Button>
      )}
      {showExportMenu && (
        <Menu
          data-testid="header-option-export-menu"
          anchorEl={exportButtonRef.current}
          onClose={() => setShowExportMenu(false)}
          menuItems={getExportActions()}
        />
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
        data-testid={'export-data'}
      />
    </StyledFlexTopCenter>
  ) : null;
};
