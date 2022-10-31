import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController } from 'components/FormComponents/InputController';
import CheckboxController from 'components/FormComponents/CheckboxController';
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
  StyledBack,
} from './styles';
import { signUpSchema } from './schema';

export interface SignUpData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  termsOfService: boolean;
}

const SignUp = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignUpData>({
    resolver: yupResolver(signUpSchema()),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      termsOfService: false,
    },
  });

  const onSubmit = (data: SignUpData) => {
    console.log('data', data);
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
            <StyledController>
              <CheckboxController
                name="termsOfService"
                control={control}
                label={
                  <StyledLabel>
                    {t('agreement')}
                    <StyledLink>{t('termsOfService')}</StyledLink>
                  </StyledLabel>
                }
              />
            </StyledController>
            <StyledButton variant="contained" type="submit">
              {t('createAccount')}
            </StyledButton>
            <StyledBack onClick={() => navigate('/auth')}>{t('backToLogin')}</StyledBack>
          </StyledForm>
        </StyledContainer>
      </StyledContainerWrapper>
    </StyledSignUp>
  );
};

export default SignUp;
