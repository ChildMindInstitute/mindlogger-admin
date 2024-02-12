import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { InputController, CheckboxController } from 'shared/components/FormComponents';
import { variables, StyledErrorText, StyledLinkBtn } from 'shared/styles';
import { Mixpanel } from 'shared/utils';
import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';

import {
  StyledSignUpHeader,
  StyledForm,
  StyledController,
  StyledLabel,
  StyledLink,
  StyledButton,
  StyledBackWrapper,
} from './SignUpForm.styles';
import { SignUpFormSchema } from './SignUpForm.schema';
import { SignUpData } from './SignUpForm.types';

export const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control, watch } = useForm<SignUpData>({
    resolver: yupResolver(SignUpFormSchema()),
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

  const onSubmit = async ({ email, password, firstName, lastName }: SignUpData) => {
    setErrorMessage('');
    const { signUp } = auth.thunk;
    const body = {
      email,
      password,
      firstName,
      lastName,
    };

    const result = await dispatch(signUp({ body }));

    if (signUp.fulfilled.match(result)) {
      navigateToLibrary(navigate);

      Mixpanel.track('Signup Successful');
    }

    if (signUp.rejected.match(result)) {
      setErrorMessage(result.payload as string);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledSignUpHeader color={variables.palette.on_surface}>
        {t('createAccount')}
      </StyledSignUpHeader>
      <StyledController>
        <InputController
          fullWidth
          name="email"
          control={control}
          label={t('email')}
          data-testid="signup-form-email"
        />
      </StyledController>
      <StyledController>
        <InputController
          fullWidth
          name="firstName"
          control={control}
          label={t('firstName')}
          data-testid="signup-form-fname"
        />
      </StyledController>
      <StyledController>
        <InputController
          fullWidth
          name="lastName"
          control={control}
          label={t('lastName')}
          data-testid="signup-form-lname"
        />
      </StyledController>
      <StyledController>
        <InputController
          fullWidth
          name="password"
          control={control}
          label={t('password')}
          type="password"
          data-testid="signup-form-password"
        />
      </StyledController>
      {errorMessage && <StyledErrorText marginTop={0}>{errorMessage}</StyledErrorText>}
      {/* <AdvancedSettings /> */}
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
          data-testid="signup-form-terms"
        />
      </StyledController>
      <StyledButton
        variant="contained"
        type="submit"
        disabled={!termsOfService}
        data-testid="signup-form-signup"
      >
        {t('createAccount')}
      </StyledButton>
      <StyledBackWrapper>
        <StyledLinkBtn onClick={() => navigate(page.login)} data-testid="signup-form-back">
          {t('backToLogin')}
        </StyledLinkBtn>
      </StyledBackWrapper>
    </StyledForm>
  );
};
