import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Encryption, getEncryptionToServer, Mixpanel } from 'shared/utils';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledModalWrapper, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';
import { applet, auth, banners, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { ApiResponseCodes, duplicateAppletApi, getAppletUniqueNameApi } from 'api';

import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
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
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const { handleSubmit, control, trigger, getValues, setValue } =
    useForm<DuplicatePopupsFormValues>({
      resolver: yupResolver(
        yup.object({
          name: yup.string().required(t('nameRequired')!),
        }),
      ),
      defaultValues: { name: '' },
    });

  const { execute: executeGetName, isLoading: isGetNameLoading } = useAsync(
    getAppletUniqueNameApi,
    (res) => {
      setValue('name', res?.data?.result?.name ?? '');
    },
    () => {
      setErrorModalVisible(true);
    },
  );

  const { execute: executeGetNameSecond, isLoading: isGetNameSecondLoading } = useAsync(
    getAppletUniqueNameApi,
    (res) => {
      const currentName = getValues('name');
      const nameFromApi = res?.data?.result?.name;
      if (nameFromApi === currentName) {
        setNameModalVisible(false);
        setPasswordModalVisible(true);

        return;
      }
      setNameError(t('appletNameExists'));
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

      handleDuplicateSuccess();
    },
    (error) => {
      setPasswordModalVisible(false);
      if (error?.response?.status === ApiResponseCodes.Forbidden) return;

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

  const errorModalClose = () => {
    setErrorModalVisible(false);
    duplicatePopupsClose();
  };

  const passwordModalClose = () => {
    setPasswordModalVisible(false);
    duplicatePopupsClose();
  };

  const handleDuplicateSuccess = () => {
    setPasswordModalVisible(false);

    onCloseCallback?.();
    duplicatePopupsClose();

    Mixpanel.track('Applet Created Successfully');

    dispatch(
      banners.actions.addBanner({
        key: 'SaveSuccessBanner',
        bannerProps: {
          children: t('successDuplication', { appletName: currentAppletName }),
        },
      }),
    );
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

  const setNameHandler = async () => {
    await executeGetNameSecond({ name: getValues('name') });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('name', event.target.value);
    setNameError(null);
    trigger('name');
  };
  const isLoading = isGetNameLoading || isGetNameSecondLoading;
  const dataTestid = 'dashboard-applets-duplicate-popup';

  useEffect(() => {
    if (!duplicatePopupsVisible) return;
    (async () => {
      await executeGetName({ name: currentAppletName });
      setNameModalVisible(true);
    })();
  }, [duplicatePopupsVisible]);

  return (
    <>
      <Modal
        open={nameModalVisible}
        onClose={nameModalClose}
        title={t('appletDuplication')}
        onSubmit={setNameHandler}
        buttonText={t('submit')}
        disabledSubmit={isLoading}
        data-testid={dataTestid}
      >
        <>
          {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
          <StyledModalWrapper>
            <form onSubmit={handleSubmit(setNameHandler)} noValidate>
              <InputController
                fullWidth
                name="name"
                control={control}
                label={t('appletName')}
                onChange={handleNameChange}
                error={!!nameError}
                data-testid={`${dataTestid}-name`}
              />
            </form>
            {nameError && (
              <StyledErrorText marginTop={0.5} marginBottom={0}>
                {nameError}
              </StyledErrorText>
            )}
          </StyledModalWrapper>
        </>
      </Modal>
      {passwordModalVisible && (
        <AppletPasswordPopup
          appletId={currentAppletId}
          onClose={passwordModalClose}
          popupType={AppletPasswordPopupType.Create}
          popupVisible={passwordModalVisible}
          submitCallback={submitCallback}
          isLoading={isDuplicateLoading}
          data-testid={`${dataTestid}-password-popup`}
        />
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
          data-testid={`${dataTestid}-error-popup`}
        >
          <StyledModalWrapper sx={{ color: variables.palette.semantic.error }}>
            {t('errorDuplication')}
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
