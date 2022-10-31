import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController } from 'components/FormComponents/InputController';
import {
  StyledForm,
  StyledResetPasswordHeader,
  StyledResetPasswordSubheader,
  StyledController,
  StyledButton,
  StyledBack,
} from './styles';
import { resetSchema } from './schema';

export interface ResetData {
  email: string;
}

const ResetForm = ({ setEmail }: { setEmail: React.Dispatch<React.SetStateAction<string>> }) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<ResetData>({
    resolver: yupResolver(resetSchema()),
  });

  const onSubmit = (data: ResetData) => {
    // TODO: make the http request
    // if succuss
    setEmail(data.email);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledResetPasswordHeader>{t('resetPassword')}</StyledResetPasswordHeader>
      <StyledResetPasswordSubheader>
        {t('enterEmailAssociatedWithAccount')}
      </StyledResetPasswordSubheader>
      <StyledController>
        <InputController fullWidth name="email" control={control} label={t('email')} />
      </StyledController>
      <StyledButton variant="contained" type="submit">
        {t('sendResetLink')}
      </StyledButton>
      <StyledBack onClick={() => navigate('/auth')}>{t('backToLogin')}</StyledBack>
    </StyledForm>
  );
};

export default ResetForm;
