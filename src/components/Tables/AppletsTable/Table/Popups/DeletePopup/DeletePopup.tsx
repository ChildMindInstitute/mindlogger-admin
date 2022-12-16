import { useTranslation } from 'react-i18next';

import { Modal } from 'components/Popups';
import { useAsync } from 'hooks/useAsync';
import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';
import { isError } from 'utils/errors';

import { DeletePopupProps } from './DeletePopup.types';
import { StyledConfirmation } from './DeletePopup.styles';

export const DeletePopup = ({ deletePopupVisible, onClose, item }: DeletePopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const accountData = account.useData();
  const { execute } = useAsync(() => deleteAppletApi({ appletId: item.id || '' }));

  const handleDeleteApplet = async () => {
    const result = await execute();
    if (!isError(result)) {
      dispatch(account.thunk.switchAccount({ accountId: accountData?.account.accountId || '' }));
      onClose();
    }
  };

  return (
    <Modal
      open={deletePopupVisible}
      onClose={onClose}
      onSubmit={handleDeleteApplet}
      title={t('deleteApplet')}
      buttonText={t('ok')}
    >
      <StyledConfirmation>{t('confirmDeleteApplet')}</StyledConfirmation>
    </Modal>
  );
};
