import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
} from './styles';
import { loginSchema } from './schema';

export interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<LoginData>({
    resolver: yupResolver(loginSchema()),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginData) => {
    console.log('data', data);
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

export default Login;
