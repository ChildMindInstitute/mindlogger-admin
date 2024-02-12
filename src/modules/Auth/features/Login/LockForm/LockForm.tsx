import { useState } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignIn } from 'api';
import { useAppDispatch } from 'redux/store';
import { InputController } from 'shared/components/FormComponents';
import { variables, StyledBodyMedium, StyledHeadline, StyledTitleMedium, StyledErrorText } from 'shared/styles';
import { auth, User } from 'redux/modules';
import { useLogout } from 'shared/hooks/useLogout';
import { Avatar } from 'shared/components';

import { loginFormSchema } from '../Login.schema';
import {
  StyledWelcome,
  StyledLoginSubheader,
  StyledForm,
  StyledController,
  StyledUserInfoController,
  StyledButton,
  StyledImageContainer,
  StyledUserInfo,
} from '../Login.styles';

export const LockForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');

  const { email, firstName, lastName } = auth.useData()?.user as User;
  const userInitials = auth.useUserInitials();
  const fullName = `${firstName} ${lastName}`;
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, control } = useForm<SignIn>({
    resolver: yupResolver(loginFormSchema()),
    defaultValues: { email, password: '' },
  });

  const handleLogout = useLogout();

  const onSubmit = async (data: SignIn) => {
    setErrorMessage('');
    const { signIn } = auth.thunk;
    const result = await dispatch(signIn(data));

    if (signIn.rejected.match(result)) {
      setErrorMessage(result.payload as string);
    }
  };

  return (
    <>
      <StyledWelcome>{t('mindLoggerAdminPanel')}</StyledWelcome>
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadline>{t('login')}</StyledHeadline>
        <StyledLoginSubheader>
          <Trans i18nKey="lockDescription" />
        </StyledLoginSubheader>
        <StyledUserInfoController>
          <StyledImageContainer>
            <Avatar caption={userInitials} />
          </StyledImageContainer>
          <StyledUserInfo>
            <StyledTitleMedium sx={{ color: variables.palette.on_surface }}>{fullName}</StyledTitleMedium>
            <StyledBodyMedium sx={{ color: variables.palette.on_surface_variant }}>{email}</StyledBodyMedium>
          </StyledUserInfo>
        </StyledUserInfoController>
        <StyledController>
          <InputController
            fullWidth
            name="password"
            control={control}
            label={t('password')}
            type="password"
            data-testid="lock-form-password"
          />
        </StyledController>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        <StyledButton variant="contained" type="submit" data-testid="lock-form-login">
          {t('login')}
        </StyledButton>
        <StyledButton variant="outlined" onClick={handleLogout} data-testid="lock-form-logout">
          {t('logOut')}
        </StyledButton>
      </StyledForm>
    </>
  );
};
