import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AxiosError } from 'axios';

import { InputController } from 'components/FormComponents';
import { Modal } from 'components/Popups';
import { folders, ErrorResponse } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { TransferOwnershipPopupProps, TransferOwnership } from './TransferOwnershipPopup.types';
import {
  StyledForm,
  StyledConfirmation,
  StyledInputWrapper,
  StyledErrorText,
} from './TransferOwnershipPopup.styles';

export const TransferOwnershipPopup = ({
  transferOwnershipPopupVisible,
  setTransferOwnershipPopupVisible,
  item,
}: TransferOwnershipPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { handleSubmit, control } = useForm<TransferOwnership>({
    resolver: yupResolver(
      yup.object({
        email: yup.string().email(t('incorrectEmail')!),
      }),
    ),
    defaultValues: { email: '' },
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleTransferOwnership = async ({ email }: TransferOwnership) => {
    const { transferOwnership } = folders.thunk;
    const result = await dispatch(transferOwnership({ appletId: item.id, email }));

    if (transferOwnership.fulfilled.match(result)) {
      setTransferOwnershipPopupVisible(false);
    } else if (transferOwnership.rejected.match(result)) {
      const errorObj = result.payload as AxiosError;
      const errorData = errorObj.response?.data as AxiosError<ErrorResponse>;
      if (errorData) {
        setErrorMessage(errorData.message);
      } else {
        setErrorMessage(errorObj.message);
      }
    }
  };

  return (
    <Modal
      open={transferOwnershipPopupVisible}
      onClose={() => setTransferOwnershipPopupVisible(false)}
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
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
      </StyledForm>
    </Modal>
  );
};
