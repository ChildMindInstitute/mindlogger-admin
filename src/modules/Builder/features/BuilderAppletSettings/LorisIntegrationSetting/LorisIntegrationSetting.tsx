import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';
import { StyledAppletSettingsDescription } from 'shared/features/AppletSettings/AppletSettings.styles';

export const LorisIntegrationSetting = () => {
  const { t } = useTranslation('app');
  const { control } = useFormContext();
  const dataTestid = 'applet-settings-loris-integration';

  return (
    <>
      <StyledAppletSettingsDescription>{t('activateDataForLoris')}</StyledAppletSettingsDescription>
      <CheckboxController
        control={control}
        sx={{ ml: theme.spacing(1.4) }}
        name="lorisCollectionEnabled"
        label={<StyledBodyLarge>{t('activateDataCollection')}</StyledBodyLarge>}
        data-testid={`${dataTestid}-checkbox`}
      />
      <StyledFlexTopCenter sx={{ pt: theme.spacing(1.4) }}>
        <Button
          sx={{ minWidth: '20rem', mr: theme.spacing(1.2) }}
          variant="contained"
          data-testid={`${dataTestid}-upload`}
        >
          {t('uploadPublicData')}
        </Button>
        <Button sx={{ minWidth: '10.3rem' }} variant="outlined" data-testid={`${dataTestid}-save`}>
          {t('save')}
        </Button>
      </StyledFlexTopCenter>
    </>
  );
};
