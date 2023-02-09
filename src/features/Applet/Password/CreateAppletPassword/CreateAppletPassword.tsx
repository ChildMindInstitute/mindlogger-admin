import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { InputController } from 'components/FormComponents';
import { Svg } from 'components';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import {
  AppletPasswordForm,
  AppletPasswordProps,
  AppletPasswordRef,
} from './CreateAppletPassword.types';
import { createPasswordFormSchema } from './CreateAppletPassword.schema';
import { StyledController, StyledHint } from '../Password.styles';

export const CreateAppletPassword = forwardRef<AppletPasswordRef, AppletPasswordProps>(
  ({ submitCallback }, ref) => {
    const { t } = useTranslation('app');

    const { handleSubmit, control } = useForm<AppletPasswordForm>({
      resolver: yupResolver(createPasswordFormSchema()),
      defaultValues: { appletPassword: '', appletPasswordConfirmation: '' },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showAppletPasswordConfirmation, setShowAppletPasswordConfirmation] = useState(false);

    const submitForm = ({ appletPassword }: AppletPasswordForm) =>
      submitCallback && submitCallback({ appletPassword });

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(submitForm)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <StyledBodyLarge
          color={variables.palette.semantic.error}
          sx={{ marginBottom: theme.spacing(3.2) }}
        >
          {t('createAppletPasswordWarning')}
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
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  <Svg id={showPassword ? 'visibility-off' : 'visibility-on'} />
                </StyledClearedButton>
              ),
            }}
          />
          <StyledHint>{t('enterAppletPasswordHint')}</StyledHint>
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
                  onClick={() => setShowAppletPasswordConfirmation((prevState) => !prevState)}
                >
                  <Svg id={showAppletPasswordConfirmation ? 'visibility-off' : 'visibility-on'} />
                </StyledClearedButton>
              ),
            }}
          />
        </StyledController>
      </form>
    );
  },
);
