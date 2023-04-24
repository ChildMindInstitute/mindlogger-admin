import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { Svg, Tooltip } from 'shared/components';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const ExportDataSetting = ({ isDisabled = false }) => {
  const { t } = useTranslation('app');
  const { appletId: id } = useParams();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  return (
    <>
      <StyledHeadline>{t('exportData')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('exportDescription')}</StyledAppletSettingsDescription>
      <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
        <Box sx={{ width: 'fit-content' }}>
          <StyledAppletSettingsButton
            onClick={() => setPasswordModalVisible(true)}
            variant="outlined"
            startIcon={<Svg width="18" height="18" id="export" />}
            disabled={isDisabled}
          >
            {t('download')}
          </StyledAppletSettingsButton>
        </Box>
      </Tooltip>
      {passwordModalVisible && (
        <AppletPasswordPopup
          popupVisible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          appletId={id ?? ''}
        />
      )}
    </>
  );
};
