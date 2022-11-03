import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

import { useAppDispatch } from 'redux/store';
import { auth, ErrorResponse } from 'redux/modules';
import { InputController } from 'components/FormComponents/InputController';
import { CheckboxController } from 'components/FormComponents/CheckboxController';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';

import {
  StyledSignUp,
  StyledContainerWrapper,
  StyledContainer,
  StyledSignUpHeader,
  StyledForm,
  StyledController,
  StyledLabel,
  StyledLink,
  StyledButton,
  StyledBackWrapper,
  StyledBack,
} from './SignUp.styles';
import { signUpSchema } from './SignUp.schema';
import { SignUpData } from './SignUp.types';

export const SignUp = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control, watch } = useForm<SignUpData>({
    resolver: yupResolver(signUpSchema()),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      termsOfService: false,
    },
  });
  const [errorMessage, setErrorMessage] = useState('');

  const termsOfService = watch('termsOfService');

  const onSubmit = async (data: SignUpData) => {
    const { termsOfService, ...args } = data;
    const result = await dispatch(auth.thunk.signUp({ body: args }));

    if (auth.thunk.signUp.fulfilled.match(result)) {
      setErrorMessage('');
    } else if (auth.thunk.signUp.rejected.match(result)) {
      const errorObj = result.payload as AxiosError;
      const errorData = errorObj.response?.data as AxiosError<ErrorResponse>;
      if (errorData) {
        setErrorMessage(errorData.message);
      }
    }
  };

  return (
    <StyledSignUp>
      <StyledContainerWrapper>
        <StyledContainer>
          <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <StyledSignUpHeader>{t('createAccount')}</StyledSignUpHeader>
            <StyledController>
              <InputController fullWidth name="email" control={control} label={t('email')} />
            </StyledController>
            <StyledController>
              <InputController
                fullWidth
                name="firstName"
                control={control}
                label={t('firstName')}
              />
            </StyledController>
            <StyledController>
              <InputController fullWidth name="lastName" control={control} label={t('lastName')} />
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
            <StyledController>
              <CheckboxController
                name="termsOfService"
                control={control}
                label={
                  <StyledLabel>
                    {t('agreement')}
                    <StyledLink href="https://mindlogger.org/terms" target="_blank">
                      {t('termsOfService')}
                    </StyledLink>
                  </StyledLabel>
                }
              />
            </StyledController>
            <StyledButton variant="contained" type="submit" disabled={!termsOfService}>
              {t('createAccount')}
            </StyledButton>
            <StyledBackWrapper>
              <StyledBack onClick={() => navigate('/auth')}>{t('backToLogin')}</StyledBack>
            </StyledBackWrapper>
          </StyledForm>
        </StyledContainer>
      </StyledContainerWrapper>
    </StyledSignUp>
  );
};
