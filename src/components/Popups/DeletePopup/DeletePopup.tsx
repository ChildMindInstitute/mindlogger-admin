import { useTranslation } from 'react-i18next';

import { Modal } from 'components/Popups';
import { useAsync } from 'hooks/useAsync';
import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';

import { DeletePopupProps } from './DeletePopup.types';
import { StyledConfirmation } from './DeletePopup.styles';

export const DeletePopup = ({
  deletePopupVisible,
  setDeletePopupVisible,
  item,
}: DeletePopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const accountData = account.useData();
  const { execute, error } = useAsync(() => deleteAppletApi({ appletId: item.id || '' }));

  const deletePopupClose = () => setDeletePopupVisible(false);

  const handleDeleteApplet = async () => {
    await execute();

    !error &&
      dispatch(account.thunk.switchAccount({ accountId: accountData?.account.accountId || '' }));
    deletePopupClose();
  };

  return (
    <Modal
      open={deletePopupVisible}
      onClose={deletePopupClose}
      onSubmit={handleDeleteApplet}
      title={t('deleteApplet')}
      buttonText={t('ok')}
    >
      <StyledConfirmation>{t('confirmDeleteApplet')}</StyledConfirmation>
    </Modal>
  );
};
