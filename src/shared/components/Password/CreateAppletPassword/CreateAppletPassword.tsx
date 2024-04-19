import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components/Svg';
import { StyledBodyLarge, StyledClearedButton, variables, theme } from 'shared/styles';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

import { CreateAppletPasswordForm, CreateAppletPasswordProps } from './CreateAppletPassword.types';
import { createPasswordFormSchema } from './CreateAppletPassword.schema';
import { StyledController } from '../Password.styles';
import { AppletPasswordRef } from '../Password.types';

export const CreateAppletPassword = forwardRef<AppletPasswordRef, CreateAppletPasswordProps>(
  ({ submitCallback, 'data-testid': dataTestid }, ref) => {
    const { t } = useTranslation('app');
    const { handleSubmit, control, watch } = useForm<CreateAppletPasswordForm>({
      resolver: yupResolver(createPasswordFormSchema()),
      defaultValues: { appletPassword: '', appletPasswordConfirmation: '' },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showAppletPasswordConfirmation, setShowAppletPasswordConfirmation] = useState(false);

    useImperativeHandle(ref, () => ({
      password: watch('appletPassword'),
      submitForm() {
        handleSubmit(submitCallback)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(submitCallback)} noValidate>
        <StyledBodyLarge
          color={variables.palette.semantic.error}
          sx={{ marginBottom: theme.spacing(3.2) }}
        >
          {t('createAppletPasswordWarning')}
        </StyledBodyLarge>
        <StyledBodyLarge
          color={variables.palette.on_surface_variant}
          sx={{ marginBottom: theme.spacing(3.2) }}
        >
          {t('createAppletPasswordRequirements')}
        </StyledBodyLarge>
        <StyledController>
          <InputController
            fullWidth
            name="appletPassword"
            control={control}
            label={t('password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <StyledClearedButton
                  aria-label="toggle password visibility"
                  onClick={toggleBooleanState(setShowPassword)}
                >
                  <Svg id={showPassword ? 'visibility-off' : 'visibility-on'} />
                </StyledClearedButton>
              ),
            }}
            data-testid={`${dataTestid}-password`}
          />
        </StyledController>
        <StyledController>
          <InputController
            fullWidth
            name="appletPasswordConfirmation"
            control={control}
            label={t('repeatPassword')}
            type={showAppletPasswordConfirmation ? 'text' : 'password'}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <StyledClearedButton
                  aria-label="toggle password visibility"
                  onClick={toggleBooleanState(setShowAppletPasswordConfirmation)}
                >
                  <Svg id={showAppletPasswordConfirmation ? 'visibility-off' : 'visibility-on'} />
                </StyledClearedButton>
              ),
            }}
            data-testid={`${dataTestid}-repeat-password`}
          />
        </StyledController>
      </form>
    );
  },
);
