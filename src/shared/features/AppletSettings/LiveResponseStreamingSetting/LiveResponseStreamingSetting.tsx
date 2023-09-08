import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyLarge, theme } from 'shared/styles';

import { StyledAppletSettingsDescription } from '../AppletSettings.styles';

export const LiveResponseStreamingSetting = () => {
  const { t } = useTranslation('app');

  const { control } = useFormContext();

  return (
    <>
      <StyledAppletSettingsDescription>
        <Trans i18nKey="liveResponseStreamingDescription" />
      </StyledAppletSettingsDescription>
      <CheckboxController
        control={control}
        sx={{ ml: theme.spacing(1.4) }}
        name="streamEnabled"
        label={<StyledBodyLarge>{t('liveResponseStreamingLabel')}</StyledBodyLarge>}
        data-testid="applet-settings-live-response-streaming"
      />
    </>
  );
};
