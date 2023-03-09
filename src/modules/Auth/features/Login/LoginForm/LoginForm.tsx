import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignIn } from 'api';
import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth/state';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledHeadline } from 'shared/styles/styledComponents';
import { getErrorMessage } from 'shared/utils/errors';

import {
  StyledWelcome,
  StyledLoginSubheader,
  StyledForm,
  StyledController,
  StyledButton,
  StyledForgotPasswordLink,
} from '../Login.styles';
import { loginFormSchema } from '../Login.schema';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignIn>({
    resolver: yupResolver(loginFormSchema()),
    defaultValues: { email: '', password: '' },
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: SignIn) => {
    setErrorMessage('');
    const { signIn } = auth.thunk;
    const result = await dispatch(signIn(data));
    const fromUrl = location?.state?.from;

    if (fromUrl && signIn.fulfilled.match(result)) {
      navigate(fromUrl);
    }

    if (signIn.rejected.match(result)) {
      setErrorMessage(getErrorMessage(result.payload));
    }
  };

  return (
    <>
      <StyledWelcome>{t('welcome')}</StyledWelcome>
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadline>{t('login')}</StyledHeadline>
        <StyledLoginSubheader>{t('logIntoAccount')}</StyledLoginSubheader>
        <StyledController>
          <InputController
            fullWidth
            name="email"
            control={control}
            label={t('email')}
            autoComplete="username"
          />
        </StyledController>
        <StyledController>
          <InputController
            fullWidth
            name="password"
            control={control}
            label={t('password')}
            type="password"
            autoComplete="current-password"
          />
        </StyledController>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        <StyledForgotPasswordLink onClick={() => navigate(page.passwordReset)}>
          {t('forgotPassword')}
        </StyledForgotPasswordLink>
        <StyledButton variant="contained" type="submit" data-testid="submit-btn">
          {t('login')}
        </StyledButton>
        <StyledButton variant="outlined" onClick={() => navigate(page.signUp)}>
          {t('createAccount')}
        </StyledButton>
      </StyledForm>
    </>
  );
};
