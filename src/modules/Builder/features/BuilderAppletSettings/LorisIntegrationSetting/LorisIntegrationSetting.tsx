import { ReactElement, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';
import { StyledAppletSettingsDescription } from 'shared/features/AppletSettings/AppletSettings.styles';
import { useIsServerConfigured } from 'shared/hooks';
// import { Integrations } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { UploadDataPopup } from './UploadDataPopup';

export const LorisIntegrationSetting = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const { t } = useTranslation('app');
  const { control, watch } = useFormContext();
  const isServerConfigured = useIsServerConfigured();
  const lorisIntegrationCheckboxName = 'lorisIntegration';
  const lorisIntegrationChecked = watch(lorisIntegrationCheckboxName);
  const { featureFlags } = useFeatureFlags();
  const hasLorisIntegration = lorisIntegrationChecked && featureFlags.enableLorisIntegration;
  const dataTestid = 'applet-settings-loris-integration';

  const renderWithTooltip = (tooltipTitle: string | null, children: ReactElement) => (
    <Tooltip placement="top" tooltipTitle={tooltipTitle}>
      {children}
    </Tooltip>
  );

  return (
    <>
      <StyledAppletSettingsDescription>{t('loris.description')}</StyledAppletSettingsDescription>
      {renderWithTooltip(
        isServerConfigured ? null : t('loris.reportServerTooltip'),
        <Box component="span" sx={{ width: 'fit-content' }}>
          <CheckboxController
            control={control}
            sx={{ ml: theme.spacing(1.4) }}
            name={lorisIntegrationCheckboxName}
            label={<StyledBodyLarge>{t('loris.activateDataCollection')}</StyledBodyLarge>}
            disabled={!isServerConfigured}
            data-testid={`${dataTestid}-checkbox`}
          />
        </Box>,
      )}
      <StyledFlexTopCenter sx={{ pt: theme.spacing(1.4) }}>
        {renderWithTooltip(
          lorisIntegrationChecked && !featureFlags.enableLorisIntegration
            ? t('loris.publishTooltip')
            : null,
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
          </span>,
        )}
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
