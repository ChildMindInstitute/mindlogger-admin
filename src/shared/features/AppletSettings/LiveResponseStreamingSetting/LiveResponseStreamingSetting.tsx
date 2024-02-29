import { useFormContext, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyLarge, theme, variables } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';

import { StyledAppletSettingsDescription } from '../AppletSettings.styles';
import { StyledController } from './LiveResponseStreamingSetting.styles';

export const LiveResponseStreamingSetting = () => {
  const { t } = useTranslation('app');
  const { control } = useFormContext();
  const [streamEnabled] = useWatch({ name: ['streamEnabled'] });
  const dataTestid = 'applet-settings-live-response-streaming';

  return (
    <>
      <StyledAppletSettingsDescription>
        <Trans i18nKey="liveResponseStreamingDescription" />
      </StyledAppletSettingsDescription>
      <CheckboxController
        control={control}
        name="streamEnabled"
        label={
          <StyledBodyLarge color={variables.palette.on_surface_variant}>
            {t('liveResponseStreamingLabel')}
          </StyledBodyLarge>
        }
        data-testid={dataTestid}
      />
      {streamEnabled && (
        <>
          <StyledBodyLarge
            sx={{
              m: theme.spacing(1.5, 0, 2.5),
              color: variables.palette.on_surface_variant,
            }}
          >
            {t('enterServerInfo')}
          </StyledBodyLarge>
          <StyledController>
            <InputController
              fullWidth
              name="streamIpAddress"
              control={control}
              label={t('defaultIpAddress')}
              data-testid={`${dataTestid}-ip-address`}
            />
          </StyledController>
          <StyledController>
            <InputController
              fullWidth
              name="streamPort"
              control={control}
              label={t('defaultPort')}
              data-testid={`${dataTestid}-port`}
            />
          </StyledController>
        </>
      )}
    </>
  );
};
