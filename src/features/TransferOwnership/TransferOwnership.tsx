import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage } from 'utils/errors';
import { transferOwnershipApi } from 'api';
import { useAsync } from 'hooks/useAsync';
import { InputController } from 'components/FormComponents';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';

import { StyledInputWrapper } from './TransferOwnership.styles';
import { TransferOwnershipProps } from './TransferOwnership.types';

export const TransferOwnership = ({
  applet,
  isSubmitted,
  setIsSubmitted,
  setEmailTransfered,
}: TransferOwnershipProps) => {
  const { t } = useTranslation('app');
  const { getValues, handleSubmit, control } = useForm<{ email: string }>({
    resolver: yupResolver(
      yup.object({
        email: yup.string().required(t('emailRequired')!).email(t('incorrectEmail')!),
      }),
    ),
    defaultValues: { email: '' },
  });
  const { execute, error } = useAsync(transferOwnershipApi);

  const handleTransferOwnership = async () => {
    await execute({ appletId: applet.id, email: getValues().email });
    setEmailTransfered(getValues().email);
  };

  useEffect(() => {
    if (isSubmitted) {
      handleSubmit(handleTransferOwnership)();
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  return (
    <form onSubmit={handleSubmit(handleTransferOwnership)} noValidate>
      <StyledBodyLarge>
        {t('transferOwnershipConfirmation', { appletName: applet.name })}
      </StyledBodyLarge>
      <StyledInputWrapper>
        <InputController
          required
          fullWidth
          name="email"
          control={control}
          label={t('ownerEmail')}
        />
      </StyledInputWrapper>
      {error && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
    </form>
  );
};
