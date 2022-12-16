import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'components/Popups';
import { InputController } from 'components/FormComponents';
import { EnterAppletPwd } from 'components/Popups';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { useAsync } from 'hooks/useAsync';
import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { duplicateAppletApi, validateAppletNameApi } from 'api';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getErrorMessage } from 'utils/errors';

import { DuplicatePopupsProps } from './DuplicatePopups.types';

export const DuplicatePopups = ({
  duplicatePopupsVisible,
  setDuplicatePopupsVisible,
  item,
}: DuplicatePopupsProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const accountData = account.useData();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const { execute } = useAsync(() => validateAppletNameApi({ name: item.name || '' }));

  const { handleSubmit, control, setValue, getValues } = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('nameRequired')!),
      }),
    ),
    defaultValues: { name: '' },
  });

  const nameModalClose = () => {
    setNameModalVisible(false);
    setDuplicatePopupsVisible(false);
  };

  const successModalClose = () => {
    setSuccessModalVisible(false);
    setDuplicatePopupsVisible(false);
  };

  const passwordModalClose = () => {
    setPasswordModalVisible(false);
    setDuplicatePopupsVisible(false);
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
        appletId: item?.id || '',
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
      execute().then(({ data }) => data && setValue('name', data));
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
        buttonText={t('dissmiss')}
      >
        <StyledModalWrapper>{t('successDuplication')}</StyledModalWrapper>
      </Modal>
    </>
  );
};
