import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { useAsync } from 'shared/hooks/useAsync';
import { account, popups, folders } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { duplicateAppletApi, validateAppletNameApi } from 'api';
import { getAppletEncryptionInfo } from 'shared/utils/encryption';
import { page } from 'resources';

import { AppletPasswordPopupType, AppletPasswordPopup } from '../AppletPasswordPopup';

export const DuplicatePopups = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const accountData = account.useData();
  const appletsFoldersData = folders.useFlattenFoldersApplets();
  const { duplicatePopupsVisible, appletId } = popups.useData();
  const currentApplet = appletsFoldersData?.find((appletFolder) => appletFolder.id === appletId);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);

  const { handleSubmit, control, setValue, getValues } = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('nameRequired')!),
      }),
    ),
    defaultValues: { name: `${currentApplet?.name} (1)` || '' },
    // TODO: while changing endpoints, discuss with the backend the implementation of creating / checking the name of the applet
  });

  const { execute } = useAsync(
    validateAppletNameApi,
    (res) => res?.data && setValue('name', res.data as string),
  );

  const duplicatePopupsClose = () =>
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
        key: 'duplicatePopupsVisible',
        value: false,
      }),
    );

  const nameModalClose = () => {
    setNameModalVisible(false);
    duplicatePopupsClose();
  };

  const successModalClose = () => {
    setSuccessModalVisible(false);
    duplicatePopupsClose();
    history(page.dashboard);
  };

  const passwordModalClose = () => {
    setPasswordModalVisible(false);
    duplicatePopupsClose();
  };

  const submitCallback = async ({ appletPassword }: { appletPassword: string }) => {
    const encryptionInfo = getAppletEncryptionInfo({
      appletPassword,
      accountId: accountData?.account.accountId || '',
    });
    const formData = new FormData();
    formData.set(
      'encryption',
      JSON.stringify({
        appletPublicKey: Array.from(encryptionInfo.getPublicKey()),
        appletPrime: Array.from(encryptionInfo.getPrime()),
        base: Array.from(encryptionInfo.getGenerator()),
      }),
    );

    await duplicateAppletApi({
      appletId,
      options: {
        name: getValues().name || '',
      },
      data: formData,
    });
    // TODO rewrite after back changes
    setTimeout(() => {
      dispatch(account.thunk.switchAccount({ accountId: accountData?.account.accountId || '' }));
    }, 4000);

    setPasswordModalVisible(false);
    setSuccessModalVisible(true);
  };

  const setNameHandler = () => {
    setNameModalVisible(false);
    setPasswordModalVisible(true);
  };

  useEffect(() => {
    if (duplicatePopupsVisible) {
      setNameModalVisible(true);
      execute({ name: getValues().name || '' });
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
                <>{{ appletName: getValues().name }}</>
              </strong>
              has been duplicated successfully.
            </Trans>
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
