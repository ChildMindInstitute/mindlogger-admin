import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ResetPassword } from 'api';
import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth/state';
import { page } from 'resources';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledHeadline, StyledLinkBtn } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles';

import {
  StyledForm,
  StyledResetPasswordSubheader,
  StyledController,
  StyledButton,
  StyledBackWrapper,
} from './ResetForm.styles';
import { resetSchema } from './ResetForm.schema';
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

  const onSubmit = async ({ email }: ResetPassword) => {
    const { resetPassword } = auth.thunk;
    const result = await dispatch(resetPassword({ email }));

    if (resetPassword.fulfilled.match(result) && setEmail) {
      setEmail(email);
    } else if (resetPassword.rejected.match(result)) {
      setErrorMessage(result.payload as string);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledHeadline color={variables.palette.on_surface}>{t('resetPassword')}</StyledHeadline>
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
      <StyledButton variant="contained" type="submit" data-testid="reset-form-reset">
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
