import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage } from 'utils/errors';
import { transferOwnershipApi } from 'api';
import { useAsync } from 'hooks/useAsync';
import { InputController } from 'components/FormComponents';
import { StyledErrorText, StyledBodyLarge } from 'styles/styledComponents';

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
    if (applet) {
      await execute({ appletId: applet.id, email: getValues().email });
      setEmailTransfered(getValues().email);
    }
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
        <Trans i18nKey="transferOwnershipConfirmation">
          Are you sure you want to transfer ownership of the
          <strong>
            <>{{ appletName: applet?.name || t('Applet') }}</>
          </strong>
          to another user? This will only transfer the applet and no user data will be transferred.
        </Trans>
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
