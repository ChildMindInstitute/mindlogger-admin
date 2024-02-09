import { Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyLarge, theme } from 'shared/styles';

import { StyledAppletSettingsButton, StyledAppletSettingsDescription } from '../AppletSettings.styles';

export const DownloadSchemaSetting = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledAppletSettingsDescription>
        <Trans i18nKey="downloadDescription">
          <StyledBodyLarge>Download the Applet content as JSON.</StyledBodyLarge>
          <StyledBodyLarge marginTop={theme.spacing(2.4)}>
            Please update URL of contexts in Applet schema, Activity schema and change Activity / Item paths in context
            files after uploading content to GitHub.
          </StyledBodyLarge>
        </Trans>
      </StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          variant="outlined"
          startIcon={<Svg width="18" height="18" id="export" />}
          data-testid="applet-settings-download-schema-download"
        >
          {t('download')}
        </StyledAppletSettingsButton>
      </Box>
    </>
  );
};
