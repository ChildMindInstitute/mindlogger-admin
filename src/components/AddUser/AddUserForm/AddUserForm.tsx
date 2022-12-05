import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

import { InputController } from 'components/FormComponents/InputController';
import { SelectController } from 'components/FormComponents/SelectController';

import { StyledButton, StyledRow, StyledResetButton, StyledTitle } from './AddUserForm.styles';
import { fields } from './AddUserForm.const';
import { AddUserSchema } from './AddUserForm.schema';
import { FormValues } from './AdduserForm.types';

export const AddUserForm = () => {
  const { t } = useTranslation('app');
  const { handleSubmit, control } = useForm<FormValues>({
    resolver: yupResolver(AddUserSchema()),
    defaultValues: {
      firstName: '',
      lastName: '',
      nickname: '',
      email: '',
      secretUserId: '',
      role: 'user',
      language: 'en',
    },
  });
  const onSubmit = async () => null;

  return (
    <>
      <StyledTitle>{t('addUser')}</StyledTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container rowSpacing={2.4} columnSpacing={2.4}>
          {fields.map(({ name, options }) => (
            <Grid item xs={4} key={name}>
              {options ? (
                <SelectController
                  fullWidth
                  name={name}
                  control={control}
                  options={options}
                  label={t(name)}
                />
              ) : (
                <InputController fullWidth name={name} control={control} label={t(name)} />
              )}
            </Grid>
          ))}
        </Grid>
        <StyledRow>
          <StyledButton variant="contained" type="submit">
            {t('submit')}
          </StyledButton>
          <StyledResetButton variant="outlined"> {t('resetForm')}</StyledResetButton>
        </StyledRow>
      </form>
    </>
  );
};
