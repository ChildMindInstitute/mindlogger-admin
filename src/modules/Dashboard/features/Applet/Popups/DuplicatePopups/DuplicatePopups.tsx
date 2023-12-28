import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Encryption, Mixpanel, getEncryptionToServer } from 'shared/utils';
import { Modal, Spinner } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledModalWrapper, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';
import { popups, applet, auth } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { ApiResponseCodes, duplicateAppletApi, getAppletUniqueNameApi } from 'api';

import {
  AppletPasswordPopupType,
  AppletPasswordPopup,
  AppletPasswordRefType,
} from '../AppletPasswordPopup';
import { DuplicatePopupsFormValues } from './DuplicatePopups.types';

export const DuplicatePopups = ({ onCloseCallback }: { onCloseCallback?: () => void }) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const userData = auth.useData();
  const { id: accountId } = userData?.user || {};
  const setAppletPrivateKey = useAppletPrivateKeySetter();
  const { duplicatePopupsVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;
  const currentAppletName = currentApplet?.displayName ?? '';
  const currentAppletId = currentApplet?.id ?? '';
  const encryptionDataRef = useRef<{
    encryption?: Encryption;
    password?: string;
  }>({});

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);

  const { handleSubmit, control, getValues, setValue } = useForm<DuplicatePopupsFormValues>({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('nameRequired')!),
        nameFromApi: yup.string(),
      }),
    ),
    defaultValues: { name: '', nameFromApi: '' },
  });

  const { execute: executeGetName, isLoading: isGetNameLoading } = useAsync(
    getAppletUniqueNameApi,
    (res) => {
      if (res?.data?.result) {
        const nameFromApi = res.data.result.name ?? '';
        setValue('name', nameFromApi);
        setValue('nameFromApi', nameFromApi);
      }
    },
    () => {
      setErrorModalVisible(true);
    },
  );

  const { execute: executeDuplicate, isLoading: isDuplicateLoading } = useAsync(
    duplicateAppletApi,
    async () => {
      await setAppletPrivateKey({
        appletPassword: encryptionDataRef.current.password ?? '',
        encryption: encryptionDataRef.current.encryption!,
        appletId: currentAppletId,
      });
      setPasswordModalVisible(false);
      setSuccessModalVisible(true);
    },
    (error) => {
      const { status, data } = error.response || {};
      if (
        status === ApiResponseCodes.BadRequest &&
        data?.result?.[0]?.message === 'Applet already exists.'
      ) {
        return (async () => {
          await executeDuplicate({
            appletId: currentAppletId,
            options: {
              encryption: encryptionDataRef.current.encryption!,
              displayName: getValues('nameFromApi') ?? '',
            },
          });
        })();
      }
      setPasswordModalVisible(false);
      setErrorModalVisible(true);
    },
    () => {
      encryptionDataRef.current = {};
    },
  );

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
    Mixpanel.track('Applet Created Successfully');
  };

  const errorModalClose = () => {
    setErrorModalVisible(false);
    duplicatePopupsClose();
  };

  const passwordModalClose = () => {
    setPasswordModalVisible(false);
    duplicatePopupsClose();
  };

  const submitCallback = async (ref?: AppletPasswordRefType) => {
    const password = ref?.current?.password ?? '';
    const encryption = await getEncryptionToServer(password, accountId ?? '');
    encryptionDataRef.current = {
      encryption,
      password,
    };
    executeDuplicate({
      appletId: currentAppletId,
      options: {
        encryption,
        displayName: getValues('name'),
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
    if (!duplicatePopupsVisible) return;
    (async () => {
      await executeGetName({ name: currentAppletName });
      setNameModalVisible(true);
    })();
  }, [duplicatePopupsVisible]);

  return (
    <>
      {isGetNameLoading && <Spinner />}
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
          appletId={currentAppletId}
          onClose={passwordModalClose}
          popupType={AppletPasswordPopupType.Create}
          popupVisible={passwordModalVisible}
          submitCallback={submitCallback}
          isLoading={isDuplicateLoading}
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
                <>{{ appletName: currentAppletName }}</>
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
