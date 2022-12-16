import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage, isError } from 'utils/errors';
import { transferOwnershipApi } from 'api';
import { useAsync } from 'hooks/useAsync';
import { InputController } from 'components/FormComponents';
import { Modal } from 'components/Popups';

import { TransferOwnershipPopupProps, TransferOwnership } from './TransferOwnershipPopup.types';
import {
  StyledForm,
  StyledConfirmation,
  StyledInputWrapper,
  StyledErrorText,
} from './TransferOwnershipPopup.styles';

export const TransferOwnershipPopup = ({
  transferOwnershipPopupVisible,
  onClose,
  item,
}: TransferOwnershipPopupProps) => {
  const { t } = useTranslation('app');
  const { getValues, handleSubmit, control } = useForm<TransferOwnership>({
    resolver: yupResolver(
      yup.object({
        email: yup.string().required(t('emailRequired')!).email(t('incorrectEmail')!),
      }),
    ),
    defaultValues: { email: '' },
  });

  const { execute, error } = useAsync(() =>
    transferOwnershipApi({ appletId: item.id, email: getValues().email }),
  );

  const handleTransferOwnership = async () => {
    const result = await execute();
    if (!isError(result)) {
      onClose();
    }
  };

  return (
    <Modal
      open={transferOwnershipPopupVisible}
      onClose={onClose}
      onSubmit={handleSubmit(handleTransferOwnership)}
      title={t('transferAppletOwnership')}
      buttonText={t('ok')}
    >
      <StyledForm onSubmit={handleSubmit(handleTransferOwnership)} noValidate>
        <StyledConfirmation>
          {t('transferOwnershipConfirmation', { appletName: item.name })}
        </StyledConfirmation>
        <StyledInputWrapper>
          <InputController fullWidth name="email" control={control} label={t('ownerEmail')} />
        </StyledInputWrapper>
        {error && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
      </StyledForm>
    </Modal>
  );
};
