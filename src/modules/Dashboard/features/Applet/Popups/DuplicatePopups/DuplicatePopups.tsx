import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Encryption } from 'shared/utils';
import { Modal } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledModalWrapper } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { popups, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { duplicateAppletApi, getAppletUniqueNameApi } from 'api';

import { AppletPasswordPopupType, AppletPasswordPopup } from '../AppletPasswordPopup';

export const DuplicatePopups = ({ onCloseCallback }: { onCloseCallback?: () => void }) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const { duplicatePopupsVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);

  const { handleSubmit, control, getValues, setValue } = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('nameRequired')!),
      }),
    ),
    defaultValues: { name: '' },
  });

  const { execute: executeDuplicate } = useAsync(
    duplicateAppletApi,
    () => {
      setPasswordModalVisible(false);
      setSuccessModalVisible(true);
    },
    () => {
      setPasswordModalVisible(false);
      setErrorModalVisible(true);
    },
  );

  const { execute: executeGetName } = useAsync(getAppletUniqueNameApi, (res) => {
    res?.data?.result && setValue('name', res.data.result.name);
  });

  const duplicatePopupsClose = () =>
    dispatch(
      popups.actions.setPopupVisible({
        applet: currentApplet,
        encryption: undefined,
        key: 'duplicatePopupsVisible',
        value: false,
      }),
    );

  const nameModalClose = () => {
    setNameModalVisible(false);
    duplicatePopupsClose();
  };

  const successModalClose = () => {
    onCloseCallback?.();
    setSuccessModalVisible(false);
    duplicatePopupsClose();
  };

  const errorModalClose = () => {
    setErrorModalVisible(false);
    duplicatePopupsClose();
  };

  const passwordModalClose = () => {
    setPasswordModalVisible(false);
    duplicatePopupsClose();
  };

  const submitCallback = (encryption: Encryption) => {
    executeDuplicate({
      appletId: currentApplet?.id as string,
      options: {
        encryption,
        displayName: getValues().name,
      },
    });
  };

  const retryHandler = () => {
    setErrorModalVisible(false);
    setNameModalVisible(true);
  };

  const setNameHandler = () => {
    setNameModalVisible(false);
    setPasswordModalVisible(true);
  };

  useEffect(() => {
    if (duplicatePopupsVisible) {
      executeGetName({ name: currentApplet?.displayName || '' });
      setNameModalVisible(true);
    }
  }, [duplicatePopupsVisible]);

  return (
    <>
      <Modal
        open={nameModalVisible}
        onClose={nameModalClose}
        title={t('appletDuplication')}
        onSubmit={setNameHandler}
        buttonText={t('submit')}
      >
        <StyledModalWrapper>
          <form onSubmit={handleSubmit(setNameHandler)} noValidate>
            <InputController fullWidth name="name" control={control} label={t('enterAppletName')} />
          </form>
        </StyledModalWrapper>
      </Modal>
      {passwordModalVisible && (
        <AppletPasswordPopup
          appletId={currentApplet?.id ?? ''}
          onClose={passwordModalClose}
          popupType={AppletPasswordPopupType.Create}
          popupVisible={passwordModalVisible}
          submitCallback={submitCallback}
        />
      )}
      {successModalVisible && (
        <Modal
          open={successModalVisible}
          onClose={successModalClose}
          title={t('appletDuplication')}
          onSubmit={successModalClose}
          buttonText={t('ok')}
        >
          <StyledModalWrapper>
            <Trans i18nKey="successDuplication">
              Applet
              <strong>
                <>{{ appletName: currentApplet?.displayName }}</>
              </strong>
              has been duplicated successfully.
            </Trans>
          </StyledModalWrapper>
        </Modal>
      )}
      {errorModalVisible && (
        <Modal
          open={errorModalVisible}
          onClose={errorModalClose}
          title={t('appletDuplication')}
          onSecondBtnSubmit={errorModalClose}
          secondBtnText={t('cancel')}
          onSubmit={retryHandler}
          buttonText={t('retry')}
          hasSecondBtn
        >
          <StyledModalWrapper>
            <Trans i18nKey="errorDuplication">
              Applet
              <strong>
                <>{{ appletName: currentApplet?.displayName }}</>
              </strong>
              has not been duplicated. Please try again.
            </Trans>
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
