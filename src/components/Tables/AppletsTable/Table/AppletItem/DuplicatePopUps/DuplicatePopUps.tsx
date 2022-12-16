import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { BasicPopUp } from 'components/Popups/BasicPopUp';
import { InputController } from 'components/FormComponents';
import { EnterAppletPwd } from 'components/Popups';
import { StyledHeadline } from 'styles/styledComponents/Typography';
import {
  StyledModalBtn,
  StyledModalText,
  StyledModalWrapper,
  StyledInputWrapper,
} from 'styles/styledComponents/Modal';
import { useAsync } from 'hooks/useAsync';
import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { duplicateAppletApi, validateAppletNameApi } from 'api';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getErrorMessage } from 'utils/getErrorMessage';

import { DuplicatePopUpsProps } from './DuplicatePopUps.types';

export const DuplicatePopUps = ({
  duplicateModalsVisible,
  setDuplicateModalsVisible,
  item,
}: DuplicatePopUpsProps) => {
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
    setDuplicateModalsVisible(false);
  };

  const successModalClose = () => {
    setSuccessModalVisible(false);
    setDuplicateModalsVisible(false);
  };

  const passwordModalClose = () => {
    setPasswordModalVisible(false);
    setDuplicateModalsVisible(false);
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
    if (duplicateModalsVisible) {
      setNameModalVisible(true);
      execute().then(({ data }) => data && setValue('name', data));
    }
  }, [duplicateModalsVisible]);

  return (
    <>
      <BasicPopUp open={nameModalVisible} handleClose={nameModalClose}>
        <StyledModalWrapper>
          <StyledHeadline>{t('appletName')}</StyledHeadline>
          <form onSubmit={handleSubmit(setNameHandler)} noValidate>
            <StyledInputWrapper>
              <InputController
                fullWidth
                name="name"
                control={control}
                label={t('enterAppletName')}
              />
            </StyledInputWrapper>
            <StyledModalBtn variant="text" type="submit">
              {t('submit')}
            </StyledModalBtn>
          </form>
        </StyledModalWrapper>
      </BasicPopUp>
      <EnterAppletPwd
        open={passwordModalVisible}
        onClose={passwordModalClose}
        onSubmit={handleDuplicate}
        errorText={errorText}
      />
      <BasicPopUp open={successModalVisible} handleClose={successModalClose}>
        <StyledModalWrapper>
          <StyledHeadline>{t('appletDuplication')}</StyledHeadline>
          <StyledModalText>{t('successDuplication')}</StyledModalText>
          <StyledModalBtn variant="text" onClick={successModalClose}>
            {t('dissmiss')}
          </StyledModalBtn>
        </StyledModalWrapper>
      </BasicPopUp>
    </>
  );
};
