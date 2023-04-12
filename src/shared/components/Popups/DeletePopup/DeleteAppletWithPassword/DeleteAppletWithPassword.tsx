import { forwardRef, useImperativeHandle, useState } from 'react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ApiError } from 'shared/state';
import { StyledBodyLarge, StyledErrorText } from 'shared/styles';
import { StyledInputWrapper } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.styles';
import { InputController } from 'shared/components/FormComponents';
import { getErrorMessage } from 'shared/utils';

import {
  DeleteAppletWithPasswordFormValues,
  DeleteAppletWithPasswordProps,
  DeleteAppletWithPasswordRef,
} from './DeleteAppletWithPassword.types';

export const DeleteAppletWithPassword = forwardRef<
  DeleteAppletWithPasswordRef,
  DeleteAppletWithPasswordProps
>(({ onSubmit }, ref) => {
  const { t } = useTranslation('app');
  const [error, setError] = useState<null | AxiosError<ApiError>>(null);

  const { handleSubmit, control } = useForm<DeleteAppletWithPasswordFormValues>({
    resolver: yupResolver(
      yup.object({
        password: yup.string().required(t('passwordRequired')!),
      }),
    ),
    defaultValues: { password: '' },
  });

  useImperativeHandle(
    ref,
    () => ({
      onSubmit: handleSubmit(onSubmit),
      setError,
    }),
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledBodyLarge>{t('deleteAppletDescriptionWithPassword')}</StyledBodyLarge>
      <StyledInputWrapper>
        <InputController
          required
          fullWidth
          name="password"
          type={'password'}
          control={control}
          label={t('password')}
        />
      </StyledInputWrapper>
      {error && <StyledErrorText marginTop={0}>{getErrorMessage(error)}</StyledErrorText>}
    </form>
  );
});
