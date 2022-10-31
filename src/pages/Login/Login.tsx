import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignIn } from 'api';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { InputController } from 'components/FormComponents/InputController';

import {
  StyledLogin,
  StyledContainerWrapper,
  StyledContainer,
  StyledWelcome,
  StyledLoginHeader,
  StyledLoginSubheader,
  StyledForm,
  StyledController,
  StyledButton,
  StyledForgotPasswordLink,
} from './Login.styles';
import { loginSchema } from './Login.schema';

export const Login = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignIn>({
    resolver: yupResolver(loginSchema()),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignIn) => {
    const result = await dispatch(auth.thunk.login(data));

    if (auth.thunk.login.fulfilled.match(result)) {
      console.log('log in result: ', result);
    }
  };

  return (
    <StyledLogin>
      <StyledContainerWrapper>
        <StyledContainer>
          <StyledWelcome>{t('welcome')}</StyledWelcome>
          <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <StyledLoginHeader>{t('login')}</StyledLoginHeader>
            <StyledLoginSubheader>{t('logIntoAccount')}</StyledLoginSubheader>
            <StyledController>
              <InputController fullWidth name="email" control={control} label={t('email')} />
            </StyledController>
            <StyledController>
              <InputController
                fullWidth
                name="password"
                control={control}
                label={t('password')}
                type="password"
              />
            </StyledController>
            <StyledButton variant="contained" type="submit">
              {t('login')}
            </StyledButton>
            <StyledForgotPasswordLink onClick={() => navigate('/auth/reset-password')}>
              {t('forgotPassword')}
            </StyledForgotPasswordLink>
            <StyledButton variant="outlined" onClick={() => navigate('/auth/signup')}>
              {t('createAccount')}
            </StyledButton>
          </StyledForm>
        </StyledContainer>
      </StyledContainerWrapper>
    </StyledLogin>
  );
};
