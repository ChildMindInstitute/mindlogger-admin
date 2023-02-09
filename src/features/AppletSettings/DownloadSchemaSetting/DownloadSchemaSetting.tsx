import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg, Tooltip } from 'components';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const DownloadSchemaSetting = ({ isDisabled = false }) => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledHeadlineLarge>{t('downloadSchema')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('downloadDescription')}</StyledAppletSettingsDescription>
      <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
        <Box sx={{ width: 'fit-content' }}>
          <StyledAppletSettingsButton
            variant="outlined"
            startIcon={<Svg width="18" height="18" id="export" />}
            disabled={isDisabled}
          >
            {t('download')}
          </StyledAppletSettingsButton>
        </Box>
      </Tooltip>
    </>
  );
};
