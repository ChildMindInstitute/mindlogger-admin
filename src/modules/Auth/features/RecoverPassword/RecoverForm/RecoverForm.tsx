import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledHeadline, variables } from 'shared/styles';
import { approveRecoveryPasswordApi } from 'api';
import { getErrorMessage } from 'shared/utils';
import { LocationStateKeys } from 'shared/types';

import {
  StyledButton,
  StyledController,
  StyledForm,
  StyledResetPasswordSubheader,
} from './RecoverForm.styles';
import { newPasswordSchema } from './RecoverForm.schema';
import { RecoverFormFields, RecoverFormProps } from './RecoverForm.types';
import { recoverPasswordFormDataTestid } from './RecoverForm.const';

export const RecoverForm = ({ email, resetKey: key }: RecoverFormProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<RecoverFormFields>({
    resolver: yupResolver(newPasswordSchema()),
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async ({ password }: RecoverFormFields) => {
    try {
      await approveRecoveryPasswordApi({ email, key, password });
      navigate(page.login, {
        state: { [LocationStateKeys.IsPasswordReset]: true },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <StyledForm
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      data-testid={recoverPasswordFormDataTestid}
    >
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
          data-testid={`${recoverPasswordFormDataTestid}-password`}
        />
      </StyledController>
      <StyledController>
        <InputController
          fullWidth
          name="passwordConfirmation"
          type="password"
          control={control}
          label={t('confirmPassword')}
          data-testid={`${recoverPasswordFormDataTestid}-confirm-password`}
        />
      </StyledController>
      {errorMessage && (
        <StyledErrorText data-testid={`${recoverPasswordFormDataTestid}-error`}>
          {errorMessage}
        </StyledErrorText>
      )}
      <StyledButton
        variant="contained"
        type="submit"
        data-testid={`${recoverPasswordFormDataTestid}-submit`}
      >
        {t('submit')}
      </StyledButton>
    </StyledForm>
  );
};
