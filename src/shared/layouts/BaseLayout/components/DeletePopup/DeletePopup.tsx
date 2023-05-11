import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal, EnterAppletPassword } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { applet, applets, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { page } from 'resources';
import { useSetupEnterAppletPassword } from 'shared/hooks';

import { Modals } from './DeletePopup.types';

export const DeletePopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const { deletePopupVisible, appletId, encryption } = popups.useData();
  const [activeModal, setActiveModal] = useState(Modals.PasswordCheck);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletName = appletData?.displayName ?? '';

  const onClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
        encryption: '',
        key: 'deletePopupVisible',
        value: false,
      }),
    );
  };

  const { execute } = useAsync(
    deleteAppletApi,
    () => {
      // TODO: check after folder connect
      dispatch(applets.actions.deleteApplet({ id: appletId }));
      setActiveModal(Modals.Confirmation);
    },
    () => {
      setActiveModal(Modals.DeleteError);
    },
  );

  const handleDeleteApplet = async () => {
    await execute({ appletId, encryption });
  };

  const handleRetryDelete = async () => {
    await execute({ appletId, encryption });
  };

  const handleConfirmation = () => {
    onClose();
    history(page.dashboard);
  };

  switch (activeModal) {
    case Modals.PasswordCheck:
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
            />
          </StyledModalWrapper>
        </Modal>
      );
    case Modals.Confirmation:
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
    case Modals.DeleteError:
      return (
        <Modal
          open={deletePopupVisible}
          onClose={onClose}
          onSubmit={handleRetryDelete}
          title={t('deleteApplet')}
          buttonText={t('retry')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          onSecondBtnSubmit={onClose}
        >
          <StyledModalWrapper>
            <Trans i18nKey="appletDeletedError">
              Applet
              <strong>
                <>{{ appletName }}</>
              </strong>
              has not been deleted. Please try again.
            </Trans>
          </StyledModalWrapper>
        </Modal>
      );
  }
};
