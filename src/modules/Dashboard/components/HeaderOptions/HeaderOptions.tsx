import { useRef, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { Menu, Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import {
  Mixpanel,
  checkIfCanAccessData,
  checkIfCanEdit,
  MixpanelEventType,
  MixpanelProps,
  checkIfFullAccess,
} from 'shared/utils';
import { workspaces } from 'shared/state';
import { AuditLogsExportSetting } from 'shared/features/AppletSettings/AuditLogsExportSetting/AuditLogsExportSetting';

export const HeaderOptions = () => {
  const [isResponseDataExportOpen, setIsResponseDataExportOpen] = useState(false);
  const [isAuditLogsExportOpen, setIsAuditLogsExportOpen] = useState(false);

  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const isSettingsSelected = location.pathname.includes('settings');
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenExportMenu = () => {
    const fullAccess = checkIfFullAccess(roles);

    if (fullAccess) {
      setShowExportMenu(true);
    } else {
      setIsResponseDataExportOpen(true);
      Mixpanel.track({ action: MixpanelEventType.ExportDataClick });
    }
  };

  const handleOpenAuditLogs = () => {
    setIsAuditLogsExportOpen(true);
    Mixpanel.track({
      action: MixpanelEventType.ExportAuditLogsClick,
      [MixpanelProps.AppletId]: appletId,
    });
  };

  const handleOpenResponseData = () => {
    setIsResponseDataExportOpen(true);
    Mixpanel.track({ action: MixpanelEventType.ExportDataClick });
  };

  const handleCloseResponseData = () => {
    setIsResponseDataExportOpen(false);
  };

  const handleCloseAuditLogsExport = () => {
    setIsAuditLogsExportOpen(false);
  };

  const canAccessData = checkIfCanAccessData(roles);
  const canEdit = checkIfCanEdit(roles);

  const getExportActions = () => [
    {
      icon: <Svg id="response-data" />,
      action: handleOpenResponseData,
      title: t('dataExport.responseData.menuCaption'),
      'data-testid': 'header-option-response-data-button',
    },
    {
      icon: <Svg id="audit-logs" />,
      action: handleOpenAuditLogs,
      title: t('dataExport.auditLogs.menuCaption'),
      'data-testid': 'header-option-audit-logs-button',
    },
  ];

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
        isExportSettingsOpen={isResponseDataExportOpen}
        onExportSettingsClose={handleCloseResponseData}
        data-testid={'response-data-export'}
      />
      <AuditLogsExportSetting
        isExportSettingsOpen={isAuditLogsExportOpen}
        onExportSettingsClose={handleCloseAuditLogsExport}
        data-testid={'audit-logs-export'}
        onExportPopupClose={() => setIsAuditLogsExportOpen(false)}
      />
    </StyledFlexTopCenter>
  ) : null;
};
