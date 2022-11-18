import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

import { SignIn } from 'api';
import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, ErrorResponse } from 'redux/modules';
import { InputController } from 'components/FormComponents/InputController';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { StyledHeadline } from 'styles/styledComponents/Typography';

import {
  StyledLogin,
  StyledContainerWrapper,
  StyledContainer,
  StyledWelcome,
  StyledLoginSubheader,
  StyledForm,
  StyledController,
  StyledButton,
  StyledForgotPasswordLink,
} from './Login.styles';
import { loginSchema } from './Login.schema';

export const Login = ({ onSubmitForTest }: { onSubmitForTest?: () => void }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignIn>({
    resolver: yupResolver(loginSchema()),
    defaultValues: { email: '', password: '' },
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: SignIn) => {
    if (onSubmitForTest) {
      onSubmitForTest();
    }

    const { signIn } = auth.thunk;
    const result = await dispatch(signIn(data));

    if (signIn.fulfilled.match(result)) {
      setErrorMessage('');
    } else if (signIn.rejected.match(result)) {
      const errorObj = result.payload as AxiosError;
      const errorData = errorObj.response?.data as AxiosError<ErrorResponse>;
      if (errorData) {
        setErrorMessage(errorData.message);
      } else {
        setErrorMessage(errorObj.message);
      }
    }
  };

  return (
    <StyledLogin>
      <StyledContainerWrapper>
        <StyledContainer>
          <StyledWelcome>{t('welcome')}</StyledWelcome>
          <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <StyledHeadline>{t('login')}</StyledHeadline>
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
        </StyledContainer>
      </StyledContainerWrapper>
    </StyledLogin>
  );
};
