import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignIn } from 'api';
import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth/state';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledHeadline } from 'shared/styles/styledComponents';
import { getErrorMessage, Mixpanel, navigateToLibrary } from 'shared/utils';
import { variables } from 'shared/styles';

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

  useEffect(() => {
    Mixpanel.trackPageView('Login');
  }, []);

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: SignIn) => {
    setErrorMessage('');
    const { signIn } = auth.thunk;
    const result = await dispatch(signIn(data));
    const fromUrl = location?.state?.from;

    if (signIn.fulfilled.match(result)) {
      if (fromUrl) navigate(fromUrl);
      navigateToLibrary(navigate);
      Mixpanel.track('Login Successful');
    }

    if (signIn.rejected.match(result)) {
      setErrorMessage(getErrorMessage(result.payload));
    }

    Mixpanel.track('Login Button click');
  };

  const handleCreateAccountClick = () => {
    navigate(page.signUp);

    Mixpanel.track('Create account button on login screen click');
  };

  return (
    <>
      <StyledWelcome>
        <Trans i18nKey="welcome">
          Welcome to the MindLogger <br /> Admin Panel
        </Trans>
      </StyledWelcome>
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadline color={variables.palette.on_surface}>{t('login')}</StyledHeadline>
        <StyledLoginSubheader color={variables.palette.on_surface_variant}>
          {t('logIntoAccount')}
        </StyledLoginSubheader>
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
        <StyledButton variant="outlined" onClick={handleCreateAccountClick}>
          {t('createAccount')}
        </StyledButton>
      </StyledForm>
    </>
  );
};
