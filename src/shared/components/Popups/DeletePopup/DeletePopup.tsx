import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { applets, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';
import { StyledModalWrapper } from 'shared/styles';
import { page } from 'resources';

import {
  DeleteAppletWithPasswordFormValues,
  DeleteAppletWithPasswordRef,
  DeleteAppletWithPassword,
} from './DeleteAppletWithPassword';
import { MODALS } from './DeletePopup.types';

export const DeletePopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const { deletePopupVisible, appletId } = popups.useData();
  const deleteAppletWithPasswordRef = useRef<DeleteAppletWithPasswordRef | null>(null);
  const [activeModal, setActiveModal] = useState(MODALS.PasswordCheck);

  const onClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
        key: 'deletePopupVisible',
        value: false,
      }),
    );
  };

  const { execute, error } = useAsync(deleteAppletApi, () => {
    // TODO: check after folder connect
    dispatch(applets.actions.deleteApplet({ id: appletId }));
  });

  const handleDeleteApplet = async ({ password }: DeleteAppletWithPasswordFormValues) => {
    deleteAppletWithPasswordRef.current?.setError(null);
    const response = await execute({ appletId, password });

    if (response?.status !== 204 || error) {
      return deleteAppletWithPasswordRef.current?.setError(error);
    }
    setActiveModal(MODALS.Confirmation);
  };

  const handleConfirmation = () => {
    onClose();
    history(page.dashboard);
  };

  switch (activeModal) {
    case MODALS.PasswordCheck:
      return (
        <Modal
          open={deletePopupVisible}
          onClose={onClose}
          onSubmit={deleteAppletWithPasswordRef.current?.onSubmit}
          title={t('deleteApplet')}
          buttonText={t('delete')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          onSecondBtnSubmit={onClose}
        >
          <StyledModalWrapper>
            <DeleteAppletWithPassword
              ref={deleteAppletWithPasswordRef}
              onSubmit={handleDeleteApplet}
            />
          </StyledModalWrapper>
        </Modal>
      );
    case MODALS.Confirmation:
      return (
        <Modal
          open={deletePopupVisible}
          onClose={onClose}
          onSubmit={handleConfirmation}
          title={t('deleteApplet')}
          buttonText={t('ok')}
        >
          <StyledModalWrapper>{t('appletDeletedSuccessfully')}</StyledModalWrapper>
        </Modal>
      );
  }
};
