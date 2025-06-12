import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { type AxiosResponse } from 'axios';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  ApiResponseCodes,
  Applet,
  duplicateAppletApi,
  getAppletUniqueNameApi,
  ResponseWithObject,
} from 'api';
import { useCheckReportServer } from 'modules/Builder/features/ReportConfigSetting/ReportConfigSetting.hooks';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';
import { applet, auth, banners, popups, SingleApplet, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { useAsync } from 'shared/hooks/useAsync';
import {
  StyledBodyLarge,
  StyledErrorText,
  StyledFlexColumn,
  StyledModalWrapper,
  variables,
} from 'shared/styles';
import {
  Encryption,
  getEncryptionToServer,
  getPrivateKey,
  MixpanelEventType,
  publicEncrypt,
  trackAppletSave,
} from 'shared/utils';

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
  const currentApplet = {
    ...(appletData || result),
    reportServerIp: result?.reportServerIp,
    reportPublicKey: result?.reportPublicKey,
  } as SingleApplet | undefined;
  const { getApplet } = applet.thunk;
  const currentAppletName = currentApplet?.displayName ?? '';
  const currentAppletId = currentApplet?.id ?? '';
  const ownerId = workspaces.useData()?.ownerId ?? '';
  const encryptionDataRef = useRef<{
    encryption?: Encryption;
    password?: string;
  }>({});

  const currentAppHasReportServerConfigured = !!currentApplet?.reportServerIp;

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [reportServerError, setReportServerError] = useState<string | null>(null);
  const [newAppletSuccessResponse, setNewAppletSuccessResponse] = useState<AxiosResponse<
    ResponseWithObject<Applet>
  > | null>(null);

  const { onVerify: verifyCurrentAppletReportServer } = useCheckReportServer({
    url: currentApplet?.reportServerIp ?? '',
    publicKey: currentApplet?.reportPublicKey ?? '',
    appletId: currentAppletId,
    ownerId,
  });

  const { onSetPassword: setNewAppletReportServerPassword } = useCheckReportServer({
    url: newAppletSuccessResponse?.data.result.reportServerIp ?? '',
    publicKey: newAppletSuccessResponse?.data.result.reportPublicKey ?? '',
    appletId: newAppletSuccessResponse?.data.result.id ?? '',
    ownerId,
  });

  const { handleSubmit, control, trigger, watch, getValues, setValue } =
    useForm<DuplicatePopupsFormValues>({
      resolver: yupResolver(
        yup.object({
          name: yup.string().required(t('nameRequired')!),
          includeReportServer: yup.boolean().required(),
        }),
      ),
      defaultValues: { name: '', includeReportServer: false },
    });

  const { includeReportServer } = watch();

  const { execute: executeGetName, isLoading: isGetNameLoading } = useAsync(
    getAppletUniqueNameApi,
    {
      successCallback: (res) => {
        setValue('name', res?.data?.result?.name ?? '');
      },
      errorCallback: () => {
        setErrorModalVisible(true);
      },
    },
  );

  const resetEncryptionData = useCallback(() => (encryptionDataRef.current = {}), []);

  const { execute: executeDuplicate, isLoading: isDuplicateLoading } = useAsync(
    duplicateAppletApi,
    async (res) => {
      setNewAppletSuccessResponse(res);
    },
    (error) => {
      setPasswordModalVisible(false);
      if (error?.response?.status === ApiResponseCodes.Forbidden) return;

      setErrorModalVisible(true);
      resetEncryptionData();
    },
  );

  const duplicatePopupsClose = useCallback(
    () =>
      dispatch(
        popups.actions.setPopupVisible({
          applet: currentApplet,
          key: 'duplicatePopupsVisible',
          value: false,
        }),
      ),
    [currentApplet, dispatch],
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

  const handleDuplicateSuccess = useCallback(
    ({ data }: AxiosResponse) => {
      setPasswordModalVisible(false);

      onCloseCallback?.();
      duplicatePopupsClose();
      resetEncryptionData();

      trackAppletSave({ action: MixpanelEventType.AppletCreatedSuccessfully, applet: data.result });

      dispatch(
        banners.actions.addBanner({
          key: 'SaveSuccessBanner',
          bannerProps: {
            children: t('successDuplication', {
              appletName: data.result?.displayName ?? '',
            }),
          },
        }),
      );
    },
    [dispatch, duplicatePopupsClose, onCloseCallback, resetEncryptionData, t],
  );

  const submitPasswordCallback = async (ref?: AppletPasswordRefType) => {
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
        includeReportServer,
      },
    });
  };

  const retryHandler = () => {
    setErrorModalVisible(false);
    setNameModalVisible(true);
  };

  const onSubmitNameModal = async () => {
    let nameIsValid = false;
    let reportServerIsValid = !includeReportServer;

    try {
      const res = await getAppletUniqueNameApi({ name: getValues('name') });
      const currentName = getValues('name');
      const nameFromApi = res?.data?.result?.name;
      if (nameFromApi === currentName) {
        nameIsValid = true;
      } else {
        setNameError(t('appletNameExists'));
      }
    } catch (e) {
      setErrorModalVisible(true);
    }

    if (includeReportServer) {
      reportServerIsValid = await verifyCurrentAppletReportServer();
      if (!reportServerIsValid) {
        setReportServerError(t('reportServerInvalid'));
      } else {
        setReportServerError(null);
      }
    }

    if (nameIsValid && reportServerIsValid) {
      setNameModalVisible(false);
      setPasswordModalVisible(true);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue('name', event.target.value);
    setNameError(null);
    void trigger('name');
  };
  const isLoading = isGetNameLoading;
  const dataTestid = 'dashboard-applets-duplicate-popup';

  useEffect(() => {
    if (!duplicatePopupsVisible) return;
    (async () => {
      await executeGetName({ name: currentAppletName });
      setNameModalVisible(true);
    })();
  }, [duplicatePopupsVisible]);

  useEffect(() => {
    async function effect() {
      if (!newAppletSuccessResponse || !duplicatePopupsVisible) return;

      await setAppletPrivateKey({
        appletPassword: encryptionDataRef.current.password ?? '',
        encryption: encryptionDataRef.current.encryption!,
        appletId: currentAppletId,
      });

      if (includeReportServer) {
        // This request has a (very small) potential to fail. Ideally we would do this before the
        // duplication takes place, but we can't since we need the ID of the new applet
        // for the request. The best we could do is notify the user of the reason for the failure,
        // but we don't have any proper workaround for this.
        await setNewAppletReportServerPassword(
          await publicEncrypt(
            JSON.stringify({
              password: encryptionDataRef.current.password ?? '',
              privateKey: await getPrivateKey({
                appletPassword: encryptionDataRef.current.password ?? '',
                accountId: ownerId,
              }),
            }),
            currentApplet?.reportPublicKey ?? '',
          ),
        );
      }

      handleDuplicateSuccess(newAppletSuccessResponse);
    }

    void effect();
  }, [
    currentApplet?.reportPublicKey,
    currentAppletId,
    duplicatePopupsVisible,
    handleDuplicateSuccess,
    includeReportServer,
    newAppletSuccessResponse,
    ownerId,
    setAppletPrivateKey,
    setNewAppletReportServerPassword,
  ]);

  useEffect(() => {
    async function effect() {
      // Fetch the report server properties of the applet
      await dispatch(getApplet({ appletId: currentAppletId }));
    }

    void effect();
  }, [currentAppletId, dispatch, getApplet]);

  return (
    <>
      <Modal
        open={nameModalVisible}
        onClose={nameModalClose}
        title={t('appletDuplication')}
        onSubmit={onSubmitNameModal}
        buttonText={t('submit')}
        disabledSubmit={isLoading}
        data-testid={dataTestid}
      >
        <>
          {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
          <StyledModalWrapper>
            <form onSubmit={handleSubmit(onSubmitNameModal)} noValidate>
              <StyledFlexColumn sx={{ gap: 1.6 }}>
                <Box>
                  <InputController
                    variant="outlined"
                    fullWidth
                    name="name"
                    control={control}
                    label={t('appletName')}
                    onChange={handleNameChange}
                    error={!!nameError}
                    data-testid={`${dataTestid}-name`}
                  />
                  {nameError && (
                    <StyledErrorText marginTop={0.5} marginBottom={0}>
                      {nameError}
                    </StyledErrorText>
                  )}
                </Box>
                {currentAppHasReportServerConfigured && (
                  <Box>
                    <CheckboxController
                      name={'includeReportServer'}
                      control={control}
                      label={<StyledBodyLarge>{t('duplicateAppletReportServer')}</StyledBodyLarge>}
                      sxLabelProps={{ ml: 0 }}
                      sx={{ pl: 0 }}
                      data-testid={`${dataTestid}-include-report-server`}
                    />
                    {nameError && (
                      <StyledErrorText marginTop={0.5} marginBottom={0}>
                        {reportServerError}
                      </StyledErrorText>
                    )}
                  </Box>
                )}
              </StyledFlexColumn>
            </form>
          </StyledModalWrapper>
        </>
      </Modal>
      {passwordModalVisible && (
        <AppletPasswordPopup
          appletId={currentAppletId}
          onClose={passwordModalClose}
          popupType={AppletPasswordPopupType.Create}
          popupVisible={passwordModalVisible}
          submitCallback={submitPasswordCallback}
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
          <StyledModalWrapper sx={{ color: variables.palette.error }}>
            {t('errorDuplication')}
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
