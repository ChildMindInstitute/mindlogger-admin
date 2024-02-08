import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ResetPassword } from 'api';
import { auth } from 'modules/Auth/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { InputController } from 'shared/components/FormComponents';
import { variables } from 'shared/styles';
import { StyledErrorText, StyledHeadline, StyledLinkBtn } from 'shared/styles/styledComponents';

import { resetSchema } from './ResetForm.schema';
import {
  StyledForm,
  StyledResetPasswordSubheader,
  StyledController,
  StyledButton,
  StyledBackWrapper,
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
        <InputController fullWidth name="email" control={control} label={t('email')} data-testid="reset-form-email" />
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
