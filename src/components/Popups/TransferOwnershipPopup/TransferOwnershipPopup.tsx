import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage } from 'utils/errors';
import { transferOwnershipApi } from 'api';
import { useAsync } from 'hooks/useAsync';
import { InputController } from 'components/FormComponents';
import { Modal } from 'components/Popups';
import { account, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';

import { TransferOwnership } from './TransferOwnershipPopup.types';
import {
  StyledForm,
  StyledConfirmation,
  StyledInputWrapper,
  StyledErrorText,
} from './TransferOwnershipPopup.styles';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const { transferOwnershipPopupVisible, appletId } = popups.useData();
  const accountData = account.useData();
  const currentApplet = accountData?.account?.applets?.find((el) => el.id === appletId);
  const { getValues, handleSubmit, control } = useForm<TransferOwnership>({
    resolver: yupResolver(
      yup.object({
        email: yup.string().required(t('emailRequired')!).email(t('incorrectEmail')!),
      }),
    ),
    defaultValues: { email: '' },
  });

  const onClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
        key: 'transferOwnershipPopupVisible',
        value: false,
      }),
    );
  };

  const { execute, error } = useAsync(transferOwnershipApi, () => {
    onClose();
    history(page.dashboard);
  });

  const handleTransferOwnership = async () => {
    await execute({ appletId, email: getValues().email });
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
          {t('transferOwnershipConfirmation', { appletName: currentApplet?.name || '' })}
        </StyledConfirmation>
        <StyledInputWrapper>
          <InputController fullWidth name="email" control={control} label={t('ownerEmail')} />
        </StyledInputWrapper>
        {error && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
      </StyledForm>
    </Modal>
  );
};
