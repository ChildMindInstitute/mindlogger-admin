import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage } from 'shared/utils';
import { transferOwnershipApi } from 'api';
import { useAsync } from 'shared/hooks';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledBodyLarge, theme } from 'shared/styles';

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
      <Trans i18nKey="transferOwnershipConfirmation">
        <StyledBodyLarge>
          Are you sure you want to transfer ownership of Applet
          <strong>
            <>{{ appletName: applet?.name || t('Applet') }}</>
          </strong>
          to another user?
        </StyledBodyLarge>
        <StyledBodyLarge marginTop={theme.spacing(2.4)}>
          This will only transfer the Applet. No user data will be transferred. After the new Owner
          confirms transfer, you will no longer have access to this Applet or its data.
        </StyledBodyLarge>
      </Trans>
      <StyledInputWrapper>
        <InputController
          required
          fullWidth
          name="email"
          control={control}
          label={t('ownerEmail')}
          helperText={t('transferOwnershipHelperText')}
        />
      </StyledInputWrapper>
      {error && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
    </form>
  );
};
