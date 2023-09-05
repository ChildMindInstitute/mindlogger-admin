import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Encryption, getEncryptionToServer } from 'shared/utils';
import { Modal } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledModalWrapper, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';
import { popups, applet, auth } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { duplicateAppletApi, getAppletUniqueNameApi } from 'api';

import {
  AppletPasswordPopupType,
  AppletPasswordPopup,
  AppletPasswordRefType,
} from '../AppletPasswordPopup';

export const DuplicatePopups = ({ onCloseCallback }: { onCloseCallback?: () => void }) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const userData = auth.useData();
  const { id: accountId } = userData?.user || {};
  const setAppletPrivateKey = useAppletPrivateKeySetter();
  const { duplicatePopupsVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;
  const encryptionDataRef = useRef<{
    encryption?: Encryption;
    password?: string;
  }>({});

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
      setAppletPrivateKey({
        appletPassword: encryptionDataRef.current.password ?? '',
        encryption: encryptionDataRef.current.encryption!,
        appletId: currentApplet?.id as string,
      });
      setPasswordModalVisible(false);
      setSuccessModalVisible(true);
    },
    () => {
      setPasswordModalVisible(false);
      setErrorModalVisible(true);
    },
    () => {
      encryptionDataRef.current = {};
    },
  );

  const { execute: executeGetName } = useAsync(getAppletUniqueNameApi, (res) => {
    res?.data?.result && setValue('name', res.data.result.name);
  });

  const duplicatePopupsClose = () =>
    dispatch(
      popups.actions.setPopupVisible({
        applet: currentApplet,
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

  const submitCallback = (ref?: AppletPasswordRefType) => {
    const password = ref?.current?.password ?? '';
    const encryption = getEncryptionToServer(password, accountId ?? '');
    encryptionDataRef.current = {
      encryption,
      password,
    };
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
        data-testid="dashboard-applets-duplicate-popup"
      >
        <StyledModalWrapper>
          <form onSubmit={handleSubmit(setNameHandler)} noValidate>
            <InputController
              fullWidth
              name="name"
              control={control}
              label={t('appletName')}
              data-testid="dashboard-applets-duplicate-popup-name"
            />
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
          data-testid="dashboard-applets-duplicate-popup-password-popup"
        />
      )}
      {successModalVisible && (
        <Modal
          open={successModalVisible}
          onClose={successModalClose}
          title={t('appletDuplication')}
          onSubmit={successModalClose}
          buttonText={t('ok')}
          data-testid="dashboard-applets-duplicate-popup-success-popup"
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
          buttonText={t('tryAgain')}
          hasSecondBtn
          data-testid="dashboard-applets-duplicate-popup-error-popup"
        >
          <StyledModalWrapper sx={{ color: variables.palette.semantic.error }}>
            {t('errorDuplication')}
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
