import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { Mixpanel } from 'shared/utils';

import { ActionButton } from '../ParticipantActivityDetails.styles';
import { HeaderOptionsProps } from './HeaderOptions.types';

export const HeaderOptions = ({ dataTestid, onTakeNow, onAssignActivity }: HeaderOptionsProps) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { t } = useTranslation('app');

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

      <ExportDataSetting
        isExportSettingsOpen={isExportOpen}
        onExportSettingsClose={handleCloseExport}
      />
      <ActionButton
        onClick={onAssignActivity}
        data-testid={`${dataTestid}-assign-activity`}
        sx={{ backgroundColor: variables.palette.secondary_container }}
      >
        {t('assign')}
      </ActionButton>
      <ActionButton
        variant="contained"
        onClick={onTakeNow}
        data-testid={`${dataTestid}-take-now`}
        sx={{
          backgroundColor: variables.palette.primary,
          color: variables.palette.white,
        }}
      >
        {t('takeNow')}
      </ActionButton>
    </StyledFlexTopCenter>
  );
};
