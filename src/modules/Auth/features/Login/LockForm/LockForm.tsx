import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignIn } from 'api';
import { useAppDispatch } from 'redux/store';

import { InputController } from 'shared/components/FormComponents';
import {
  variables,
  StyledBodyMedium,
  StyledHeadline,
  StyledTitleMedium,
  StyledErrorText,
} from 'shared/styles';
import { getErrorMessage } from 'shared/utils';
import avatarSrc from 'assets/images/avatar.png';
import { auth, User } from 'redux/modules';
import { useLogout } from 'shared/hooks';

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
  StyledImage,
} from '../Login.styles';

export const LockForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');

  const { email, firstName, lastName } = auth.useData()?.user as User;
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
      setErrorMessage(getErrorMessage(result.payload));
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
            {/* TODO: get user image url */}
            <StyledImage src={avatarSrc} alt="Avatar" />
          </StyledImageContainer>
          <StyledUserInfo>
            <StyledTitleMedium sx={{ color: variables.palette.on_surface }}>
              {fullName}
            </StyledTitleMedium>
            <StyledBodyMedium sx={{ color: variables.palette.on_surface_variant }}>
              {email}
            </StyledBodyMedium>
          </StyledUserInfo>
        </StyledUserInfoController>
        <StyledController>
          <InputController
            fullWidth
            name="password"
            control={control}
            label={t('password')}
            type="password"
          />
        </StyledController>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        <StyledButton variant="contained" type="submit" data-testid="submit-btn">
          {t('login')}
        </StyledButton>
        <StyledButton variant="outlined" onClick={handleLogout}>
          {t('logOut')}
        </StyledButton>
      </StyledForm>
    </>
  );
};
