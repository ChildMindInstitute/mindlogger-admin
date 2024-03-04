import { ChangeEvent } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyLarge, theme, variables } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { StyledAppletSettingsDescription } from '../AppletSettings.styles';
import { StyledController } from './LiveResponseStreamingSetting.styles';
import { OnInputChange } from './LiveResponseStreamingSetting.types';

export const LiveResponseStreamingSetting = () => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const [streamEnabled] = useWatch({ name: ['streamEnabled'] });
  const dataTestid = 'applet-settings-live-response-streaming';
  const ipAddressFieldName = 'streamIpAddress';
  const portFieldName = 'streamPort';

  const onStreamStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) return;

    setValue(ipAddressFieldName, null);
    setValue(portFieldName, null);
  };

  const onInputChange = ({ value, fieldName }: OnInputChange) => {
    const getNewValue = () => {
      if (value === '' || value === null) return null;
      if (fieldName === portFieldName && isNaN(+value)) return value;
      if (fieldName === portFieldName) return +value;

      return value;
    };
    setValue(fieldName, getNewValue(), { shouldValidate: true });
  };

  return (
    <>
      <StyledAppletSettingsDescription>
        {t('liveResponseStreamingDescription')}
      </StyledAppletSettingsDescription>
      <CheckboxController
        control={control}
        name="streamEnabled"
        label={
          <StyledBodyLarge color={variables.palette.on_surface_variant}>
            {t('liveResponseStreamingLabel')}
          </StyledBodyLarge>
        }
        onCustomChange={onStreamStatusChange}
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
              name={ipAddressFieldName}
              control={control}
              label={t('defaultIpAddress')}
              onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
                onInputChange({ value, fieldName: ipAddressFieldName })
              }
              withDebounce
              data-testid={`${dataTestid}-ip-address`}
            />
          </StyledController>
          <StyledController>
            <InputController
              fullWidth
              name={portFieldName}
              control={control}
              label={t('defaultPort')}
              onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
                onInputChange({ value, fieldName: portFieldName })
              }
              withDebounce
              data-testid={`${dataTestid}-port`}
            />
          </StyledController>
        </>
      )}
    </>
  );
};
