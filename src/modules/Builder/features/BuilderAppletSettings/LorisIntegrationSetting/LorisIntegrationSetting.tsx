import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';
import { StyledAppletSettingsDescription } from 'shared/features/AppletSettings/AppletSettings.styles';
import { useIsServerConfigured } from 'shared/hooks';

import { UploadDataPopup } from './UploadDataPopup';

export const LorisIntegrationSetting = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const { t } = useTranslation('app');
  const { control, watch } = useFormContext();
  const isServerConfigured = useIsServerConfigured();
  const lorisIntegrationFlagName = 'lorisIntegration';
  const lorisIntegrationFlag = watch(lorisIntegrationFlagName);
  const lorisIntegrationField = watch('integrations.loris');
  const hasLorisIntegration = lorisIntegrationFlag && !!lorisIntegrationField;
  const dataTestid = 'applet-settings-loris-integration';

  return (
    <>
      <StyledAppletSettingsDescription>{t('loris.description')}</StyledAppletSettingsDescription>
      <Tooltip
        placement="top"
        tooltipTitle={isServerConfigured ? null : t('loris.reportServerTooltip')}
      >
        <Box component="span" sx={{ width: 'fit-content' }}>
          <CheckboxController
            control={control}
            sx={{ ml: theme.spacing(1.4) }}
            name={lorisIntegrationFlagName}
            label={<StyledBodyLarge>{t('loris.activateDataCollection')}</StyledBodyLarge>}
            disabled={!isServerConfigured}
            data-testid={`${dataTestid}-checkbox`}
          />
        </Box>
      </Tooltip>
      <StyledFlexTopCenter sx={{ pt: theme.spacing(1.4) }}>
        <Tooltip
          tooltipTitle={
            lorisIntegrationFlag && !lorisIntegrationField ? t('loris.publishTooltip') : null
          }
        >
          <span>
            <Button
              sx={{ minWidth: '20rem', mr: theme.spacing(1.2) }}
              variant="outlined"
              disabled={!hasLorisIntegration}
              onClick={() => setPopupOpen(true)}
              data-testid={`${dataTestid}-upload`}
            >
              {t('loris.uploadPublicData')}
            </Button>
          </span>
        </Tooltip>
      </StyledFlexTopCenter>
      {popupOpen && (
        <UploadDataPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          data-testid={`${dataTestid}-popup`}
        />
      )}
    </>
  );
};
