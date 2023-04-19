import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { applets, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { page } from 'resources';
import { EnterAppletPassword, EnterAppletPasswordForm } from 'modules/Dashboard';
import { useSetupEnterAppletPassword } from 'modules/Dashboard/features/Applet/Password/EnterAppletPassword/EnterAppletPassword.hooks';

import { DeletePopupProps, MODALS } from './DeletePopup.types';

export const DeletePopup = ({ encryption }: DeletePopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const { deletePopupVisible, appletId } = popups.useData();
  const [activeModal, setActiveModal] = useState(MODALS.PasswordCheck);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();

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
    // TODO: check after folder connect
    dispatch(applets.actions.deleteApplet({ id: appletId }));
  });

  const handleDeleteApplet = async ({ appletPassword: password }: EnterAppletPasswordForm) => {
    try {
      await execute({ appletId, password });
      setActiveModal(MODALS.Confirmation);
    } catch (e) {
      //TODO: add error handler
    }
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
          onSubmit={submitForm}
          title={t('deleteApplet')}
          buttonText={t('delete')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          onSecondBtnSubmit={onClose}
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
              {t('deleteAppletDescriptionWithPassword')}
            </StyledBodyLarge>
            <EnterAppletPassword
              ref={appletPasswordRef}
              appletId={appletId}
              encryption={encryption}
              submitCallback={handleDeleteApplet}
              isApplet
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
