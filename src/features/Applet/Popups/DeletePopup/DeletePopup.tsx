import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal } from 'components';
import { useAsync } from 'hooks/useAsync';
import { folders, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { page } from 'resources';

export const DeletePopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const { deletePopupVisible, appletId } = popups.useData();

  const onClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
        key: 'deletePopupVisible',
        value: false,
      }),
    );
  };

  const { execute } = useAsync(deleteAppletApi, () => {
    dispatch(folders.actions.deleteFolderApplet({ id: appletId }));
    onClose();
    history(page.dashboard);
  });

  const handleDeleteApplet = async () => {
    await execute({ appletId });
  };

  return (
    <Modal
      open={deletePopupVisible}
      onClose={onClose}
      onSubmit={onClose}
      title={t('deleteApplet')}
      buttonText={t('cancel')}
      hasSecondBtn
      actionsAlign="end"
      secondBtnColor="error"
      secondBtnText={t('delete')}
      onSecondBtnSubmit={handleDeleteApplet}
    >
      <StyledModalWrapper>{t('confirmDeleteApplet')}</StyledModalWrapper>
    </Modal>
  );
};
