import { yupResolver } from '@hookform/resolvers/yup';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ResetPassword } from 'api';
import { auth } from 'modules/Auth/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { InputController } from 'shared/components/FormComponents';
import { useSessionElsewhereGuard } from 'shared/hooks/useSessionElsewhereGuard';
import { variables } from 'shared/styles';
import {
  StyledErrorText,
  StyledHeadlineSmall,
  StyledLinkBtn,
} from 'shared/styles/styledComponents';

import { resetSchema } from './ResetForm.schema';
import {
  StyledBackWrapper,
  StyledButton,
  StyledController,
  StyledForm,
  StyledResetPasswordSubheader,
} from './ResetForm.styles';
import { ResetFormProps } from './ResetForm.types';

export const ResetForm = ({ setEmail }: ResetFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<ResetPassword>({
    resolver: yupResolver(resetSchema()),
    defaultValues: { email: '' },
  });

  const [errorMessage, setErrorMessage] = useState('');
  const { isBlocked, refuse } = useSessionElsewhereGuard();

  const onSubmit = async ({ email }: ResetPassword) => {
    const { resetPassword } = auth.thunk;
    const result = await dispatch(resetPassword({ email }));

    if (resetPassword.fulfilled.match(result) && setEmail) {
      setEmail(email);
    } else if (resetPassword.rejected.match(result)) {
      setErrorMessage(result.payload as string);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // No session is started here, but a tab that is not in the live one does not act on its own.
    // Ahead of validation, so Enter on an empty field is turned away the same way a click is.
    if (refuse()) return event.preventDefault();

    handleSubmit(onSubmit)(event);
  };

  return (
    <StyledForm onSubmit={handleFormSubmit} noValidate>
      <StyledHeadlineSmall color={variables.palette.on_surface}>
        {t('resetPassword')}
      </StyledHeadlineSmall>
      <StyledResetPasswordSubheader color={variables.palette.on_surface_variant}>
        {t('enterEmailAssociatedWithAccount')}
      </StyledResetPasswordSubheader>
      <StyledController>
        <InputController
          fullWidth
          name="email"
          control={control}
          label={t('email')}
          data-testid="reset-form-email"
        />
      </StyledController>
      {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
      <StyledButton
        variant="contained"
        type="submit"
        disabled={isBlocked}
        data-testid="reset-form-reset"
      >
        {t('sendResetLink')}
      </StyledButton>
      <StyledBackWrapper>
        <StyledLinkBtn onClick={() => navigate(page.login)} data-testid="reset-form-back">
          {t('backToLogin')}
        </StyledLinkBtn>
      </StyledBackWrapper>
    </StyledForm>
  );
};
