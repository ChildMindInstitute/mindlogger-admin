import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'components';
import { InputController } from 'components/FormComponents';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { useAsync } from 'hooks/useAsync';
import { account, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { duplicateAppletApi, validateAppletNameApi } from 'api';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getErrorMessage } from 'utils/errors';
import { page } from 'resources';

import { EnterAppletPwd } from '../EnterAppletPwd';

export const DuplicatePopups = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const accountData = account.useData();
  const { duplicatePopupsVisible, appletId } = popups.useData();
  const currentApplet = accountData?.account?.applets?.find((el) => el.id === appletId);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [errorText, setErrorText] = useState('');

  const { handleSubmit, control, setValue, getValues } = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('nameRequired')!),
      }),
    ),
    defaultValues: { name: '' },
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

  const handleDuplicate = async ({ appletPassword }: { appletPassword: string }) => {
    try {
      setErrorText('');
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
    } catch (e) {
      setErrorText(getErrorMessage(e));
    }
  };

  const setNameHandler = () => {
    setNameModalVisible(false);
    setPasswordModalVisible(true);
  };

  useEffect(() => {
    if (duplicatePopupsVisible) {
      setNameModalVisible(true);
      execute({ name: currentApplet?.name || '' });
    }
  }, [duplicatePopupsVisible]);

  return (
    <>
      <Modal
        open={nameModalVisible}
        onClose={nameModalClose}
        title={t('appletName')}
        onSubmit={setNameHandler}
        buttonText={t('submit')}
      >
        <StyledModalWrapper>
          <form onSubmit={handleSubmit(setNameHandler)} noValidate>
            <InputController fullWidth name="name" control={control} label={t('enterAppletName')} />
          </form>
        </StyledModalWrapper>
      </Modal>
      <EnterAppletPwd
        open={passwordModalVisible}
        onClose={passwordModalClose}
        onSubmit={handleDuplicate}
        errorText={errorText}
      />
      <Modal
        open={successModalVisible}
        onClose={successModalClose}
        title={t('appletDuplication')}
        onSubmit={successModalClose}
        buttonText={t('dismiss')}
      >
        <StyledModalWrapper>{t('successDuplication')}</StyledModalWrapper>
      </Modal>
    </>
  );
};
