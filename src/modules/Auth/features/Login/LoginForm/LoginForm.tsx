import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import { SignIn } from 'api';
import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledHeadline } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils';
import { variables } from 'shared/styles';
import { AUTH_BOX_WIDTH } from 'shared/consts';
import { LocationStateKeys } from 'shared/types';
import { banners } from 'redux/modules';

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
  const softLockData = auth.useSoftLockData();

  const clearSoftLock = () => {
    if (softLockData) {
      dispatch(auth.actions.endSoftLock());
      dispatch(banners.actions.removeBanner({ key: 'SoftLockWarningBanner' }));
    }
  };

  const { handleSubmit, control, setFocus } = useForm<SignIn>({
    resolver: yupResolver(loginFormSchema()),
    defaultValues: {
      email: softLockData?.email ?? '',
      password: '',
    },
  });

  const [errorMessage, setErrorMessage] = useState('');
  const onSubmit = async (data: SignIn) => {
    setErrorMessage('');
    const { signIn } = auth.thunk;
    const result = await dispatch(signIn(data));

    if (signIn.fulfilled.match(result)) {
      // If user logged in as the same user that was soft-locked, restore their nav state
      if (data.email === softLockData?.email) {
        navigate(softLockData?.redirectTo, {
          state: { [LocationStateKeys.Workspace]: softLockData.workspace },
        });
      } else {
        const fromUrl = location.state?.[LocationStateKeys.From];
        if (fromUrl) {
          navigate(fromUrl);
        } else {
          navigateToLibrary(navigate);
        }
      }

      Mixpanel.track('Login Successful');

      clearSoftLock();
    }

    if (signIn.rejected.match(result)) {
      setErrorMessage(result.payload as string);
    }
  };

  useEffect(() => {
    // Handle password reset success state
    if (location.state?.[LocationStateKeys.IsPasswordReset]) {
      // Shown for 5 seconds
      dispatch(
        banners.actions.addBanner({
          key: 'PasswordResetSuccessfulBanner',
        }),
      );

      // Unset the state after showing the notification, so that it doesn't show again if the user navigates back to this page
      navigate(window.location.pathname, {
        state: {
          ...location.state,
          [LocationStateKeys.IsPasswordReset]: undefined,
        },
        replace: true,
      });
    }

    // Display soft-lock state
    if (softLockData) {
      dispatch(banners.actions.addBanner({ key: 'SoftLockWarningBanner' }));
      setFocus('password');

      // Refocus password field when window regains focus
      const handleWindowFocus = () => {
        setFocus('password');
        window.removeEventListener('focus', handleWindowFocus);
      };

      window.addEventListener('focus', handleWindowFocus);

      return () => {
        window.removeEventListener('focus', handleWindowFocus);
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateAccountClick = () => {
    clearSoftLock();
    navigate(page.signUp);

    Mixpanel.track('Create account button on login screen click');
  };

  const handleLoginClick = () => {
    Mixpanel.track('Login Button click');
  };

  const handleResetPasswordClick = () => {
    clearSoftLock();
    navigate(page.passwordReset);
  };

  return (
    <Box sx={{ width: AUTH_BOX_WIDTH }}>
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
            data-testid="login-form-email"
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
            data-testid="login-form-password"
          />
        </StyledController>
        {errorMessage && <StyledErrorText marginTop={0}>{errorMessage}</StyledErrorText>}
        <StyledForgotPasswordLink
          onClick={handleResetPasswordClick}
          data-testid="login-form-forgot-password"
        >
          {t('forgotPassword')}
        </StyledForgotPasswordLink>
        <StyledButton
          onClick={handleLoginClick}
          variant="contained"
          type="submit"
          data-testid="login-form-signin"
        >
          {t('login')}
        </StyledButton>
        <StyledButton
          variant="outlined"
          onClick={handleCreateAccountClick}
          data-testid="login-form-signup"
        >
          {t('createAccount')}
        </StyledButton>
      </StyledForm>
    </Box>
  );
};
