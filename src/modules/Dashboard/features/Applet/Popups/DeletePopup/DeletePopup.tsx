import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  EnterAppletPassword,
  Modal,
  NoPermissionPopup,
  Spinner,
  SpinnerUiType,
} from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { alerts, applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { ApiResponseCodes, deleteAppletApi } from 'api';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';

import { DeletePopupProps, Modals } from './DeletePopup.types';

export const DeletePopup = ({ onCloseCallback, 'data-testid': dataTestid }: DeletePopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { applet: appletData, deletePopupVisible } = popups.useData();
  const [activeModal, setActiveModal] = useState(Modals.PasswordCheck);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;

  const deletePopupClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        applet: undefined,
        key: 'deletePopupVisible',
        value: false,
      }),
    );
  };

  const { execute, isLoading } = useAsync(
    deleteAppletApi,
    () => {
      setActiveModal(Modals.Confirmation);
      dispatch(alerts.actions.resetAlerts());
      dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
    },
    (error) => {
      if (error?.response?.status === ApiResponseCodes.Forbidden) {
        setActiveModal(Modals.NoPermission);

        return;
      }
      setActiveModal(Modals.DeleteError);
    },
  );

  const handleDeleteApplet = async () => {
    await execute({ appletId: currentApplet?.id ?? '' });
  };

  const handleRetryDelete = async () => {
    await execute({ appletId: currentApplet?.id ?? '' });
  };

  const handleConfirmation = () => {
    onCloseCallback?.();
    deletePopupClose();
  };

  switch (activeModal) {
    case Modals.PasswordCheck:
      return (
        <Modal
          open={deletePopupVisible}
          onClose={deletePopupClose}
          onSubmit={submitForm}
          title={t('deleteApplet')}
          buttonText={t('delete')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          disabledSubmit={isLoading}
          onSecondBtnSubmit={deletePopupClose}
          data-testid={`${dataTestid}-password-popup`}
        >
          <>
            {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
            <StyledModalWrapper>
              <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
                {t('deleteAppletDescriptionWithPassword')}
              </StyledBodyLarge>
              <EnterAppletPassword
                ref={appletPasswordRef}
                appletId={currentApplet?.id ?? ''}
                encryption={currentApplet?.encryption}
                submitCallback={handleDeleteApplet}
                data-testid={`${dataTestid}-enter-password-popup`}
              />
            </StyledModalWrapper>
          </>
        </Modal>
      );
    case Modals.Confirmation:
      return (
        <Modal
          open={deletePopupVisible}
          onClose={handleConfirmation}
          onSubmit={handleConfirmation}
          title={t('deleteApplet')}
          buttonText={t('ok')}
          data-testid={`${dataTestid}-success-popup`}
        >
          <StyledModalWrapper>{t('appletDeletedSuccessfully')}</StyledModalWrapper>
        </Modal>
      );
    case Modals.DeleteError:
      return (
        <Modal
          open={deletePopupVisible}
          onClose={deletePopupClose}
          onSubmit={handleRetryDelete}
          title={t('deleteApplet')}
          buttonText={t('retry')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          onSecondBtnSubmit={deletePopupClose}
          data-testid={`${dataTestid}-error-popup`}
        >
          <StyledModalWrapper>
            <Trans i18nKey="appletDeletedError">
              Applet
              <strong>
                <>{{ appletName: currentApplet?.displayName }}</>
              </strong>
              has not been deleted. Please try again.
            </Trans>
          </StyledModalWrapper>
        </Modal>
      );
    case Modals.NoPermission:
      return (
        <NoPermissionPopup
          open={deletePopupVisible}
          title={t('deleteApplet')}
          onSubmitCallback={handleConfirmation}
          data-testid={`${dataTestid}-no-permission-popup`}
        />
      );
  }
};
