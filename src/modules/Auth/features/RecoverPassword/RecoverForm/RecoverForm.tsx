import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { approveRecoveryPasswordApi } from 'api';
import { page } from 'resources';
import { InputController } from 'shared/components/FormComponents';
import { PasswordRequirementsSection } from 'shared/components/PasswordRequirementsSection';
import { StyledErrorText, StyledHeadlineSmall, variables } from 'shared/styles';
import { LocationStateKeys } from 'shared/types';
import { getErrorMessage } from 'shared/utils';
import { DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS } from 'shared/consts';

import { recoverPasswordFormDataTestid } from './RecoverForm.const';
import { newPasswordSchema } from './RecoverForm.schema';
import {
  StyledButton,
  StyledController,
  StyledForm,
  StyledResetPasswordSubheader,
} from './RecoverForm.styles';
import { RecoverFormFields, RecoverFormProps } from './RecoverForm.types';

export const RecoverForm = ({ email, resetKey: key }: RecoverFormProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control, trigger, clearErrors } = useForm<RecoverFormFields>({
    resolver: yupResolver(newPasswordSchema()),
  });

  const [errorMessage, setErrorMessage] = useState('');
  const watchedPassword = useWatch({ control, name: 'password' });
  const [isFirstTimeTyping, setIsFirstTimeTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!watchedPassword) {
        clearErrors('password');

        return;
      }

      if (!isFirstTimeTyping) {
        trigger('password');
      }
    }, DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [watchedPassword, trigger, clearErrors, isFirstTimeTyping]);

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
      <StyledHeadlineSmall color={variables.palette.on_surface}>
        {t('createNewPassword')}
      </StyledHeadlineSmall>
      <StyledResetPasswordSubheader color={variables.palette.on_surface_variant}>
        {t('createNewPasswordForEmail', { email })}
      </StyledResetPasswordSubheader>
      <StyledController>
        <PasswordRequirementsSection
          password={watchedPassword ?? ''}
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        >
          <InputController
            fullWidth
            name="password"
            type="password"
            control={control}
            label={t('newPassword')}
            isErrorVisible={false}
            onBlur={() => {
              if (isFirstTimeTyping) {
                // If the user is typing a password for the first time, we don't want to trigger the validation until they click out of the input
                trigger('password');
              }

              setIsFirstTimeTyping(false);
            }}
            data-testid={`${recoverPasswordFormDataTestid}-password`}
          />
        </PasswordRequirementsSection>
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
