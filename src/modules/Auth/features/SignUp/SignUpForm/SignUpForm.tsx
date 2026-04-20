import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { InputController, CheckboxController } from 'shared/components/FormComponents';
import { variables, StyledErrorText, StyledLinkBtn } from 'shared/styles';
import { Mixpanel, MixpanelEventType } from 'shared/utils';
import { PasswordRequirementsSection } from 'shared/components/PasswordRequirementsSection';
import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS } from 'shared/consts';

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
  const { handleSubmit, control, trigger, clearErrors } = useForm<SignUpData>({
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
  const watchedPassword = useWatch({ control, name: 'password' });
  const [isFirstTimeTyping, setIsFirstTimeTyping] = useState(true);
  const [showPasswordError, setShowPasswordError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!watchedPassword) {
        clearErrors('password'); // Clear any existing errors

        return;
      }

      setShowPasswordError(false);

      if (!isFirstTimeTyping) {
        trigger('password');
      }
    }, DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [watchedPassword, trigger, clearErrors]);

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

      Mixpanel.track({ action: MixpanelEventType.SignUpSuccessful });
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
        <PasswordRequirementsSection
          password={watchedPassword ?? ''}
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        >
          <InputController
            fullWidth
            isErrorVisible={showPasswordError}
            onFocus={() => setShowPasswordError(false)}
            name="password"
            control={control}
            label={t('password')}
            onBlur={() => {
              if (isFirstTimeTyping) {
                // If the user is typing a password for the first time, we don't want to trigger the validation until they click out of the input
                trigger('password');
              }

              setIsFirstTimeTyping(false);
            }}
            type="password"
            data-testid="signup-form-password"
          />
        </PasswordRequirementsSection>
      </StyledController>
      {errorMessage && <StyledErrorText marginTop={0}>{errorMessage}</StyledErrorText>}

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
        data-testid="signup-form-signup"
        onClick={() => {
          if (!watchedPassword) {
            setShowPasswordError(true);
          }
        }}
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
