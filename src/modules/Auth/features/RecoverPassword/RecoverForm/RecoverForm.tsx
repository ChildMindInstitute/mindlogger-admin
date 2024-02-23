import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledHeadline, variables } from 'shared/styles';
import { auth } from 'modules/Auth/state';

import {
  StyledButton,
  StyledController,
  StyledForm,
  StyledResetPasswordSubheader,
} from './RecoverForm.styles';
import { newPasswordSchema } from './RecoverForm.schema';
import { RecoverFormFields, RecoverFormProps } from './RecoverForm.types';

export const RecoverForm = ({ email, resetKey: key }: RecoverFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<RecoverFormFields>({
    resolver: yupResolver(newPasswordSchema()),
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async ({ password }: RecoverFormFields) => {
    const { recoverPassword } = auth.thunk;
    const result = await dispatch(recoverPassword({ email, key, password }));

    if (recoverPassword.fulfilled.match(result)) {
      navigate(page.login, {
        state: { isPasswordReset: true },
      });
    } else if (recoverPassword.rejected.match(result)) {
      setErrorMessage(result.payload as string);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledHeadline color={variables.palette.on_surface}>{t('createNewPassword')}</StyledHeadline>
      <StyledResetPasswordSubheader color={variables.palette.on_surface_variant}>
        {t('createNewPasswordForEmail', { email })}
      </StyledResetPasswordSubheader>
      <StyledController>
        <InputController
          fullWidth
          name="password"
          type="password"
          control={control}
          label={t('newPassword')}
          data-testid="recover-password-form-new-password"
        />
      </StyledController>
      <StyledController>
        <InputController
          fullWidth
          name="passwordConfirmation"
          type="password"
          control={control}
          label={t('confirmPassword')}
          data-testid="recover-password-form-confirm-password"
        />
      </StyledController>
      {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
      <StyledButton variant="contained" type="submit" data-testid="recover-password-form-submit">
        {t('submit')}
      </StyledButton>
    </StyledForm>
  );
};
