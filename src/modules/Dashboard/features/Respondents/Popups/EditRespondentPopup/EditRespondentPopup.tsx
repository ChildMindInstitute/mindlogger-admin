import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'shared/components';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { useAsync } from 'shared/hooks';
import { editRespondentApi } from 'api';
import { getErrorMessage } from 'shared/utils';

import { EditRespondentForm, EditRespondentPopupProps } from './EditRespondentPopup.types';
import { editRespondentFormSchema } from './EditRespondentPopup.schema';
import { StyledController } from './EditRespondentsPopup.styles';

export const EditRespondentPopup = ({
  popupVisible,
  setPopupVisible,
  chosenAppletData,
  setChosenAppletData,
  refetchRespondents,
}: EditRespondentPopupProps) => {
  const { t } = useTranslation('app');

  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const { handleSubmit, control, setValue, getValues } = useForm<EditRespondentForm>({
    resolver: yupResolver(editRespondentFormSchema()),
    defaultValues: { secretUserId: '', nickname: '' },
  });

  const { execute: editRespondent, error } = useAsync(editRespondentApi, () => {
    setIsSuccessVisible(true);
  });

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
    refetchRespondents();
  };

  const submitForm = () => {
    if (!chosenAppletData) return;

    const values = getValues();
    const { appletId, ownerId, respondentId } = chosenAppletData;

    editRespondent({
      values,
      appletId,
      ownerId,
      respondentId,
    });
  };

  useEffect(() => {
    const { respondentNickname = '', respondentSecretId = '' } = chosenAppletData || {};
    setValue('secretUserId', respondentSecretId);
    setValue('nickname', respondentNickname);
  }, [chosenAppletData]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={isSuccessVisible ? handlePopupClose : handleSubmit(submitForm)}
      title={t('editRespondent')}
      buttonText={t(isSuccessVisible ? 'ok' : 'save')}
      hasSecondBtn={!isSuccessVisible}
      onSecondBtnSubmit={handlePopupClose}
      secondBtnText={t('cancel')}
    >
      <StyledModalWrapper>
        {isSuccessVisible ? (
          <>{t('editRespondentSuccess')}</>
        ) : (
          <>
            <form onSubmit={handleSubmit(submitForm)} noValidate>
              <StyledController>
                <InputController
                  fullWidth
                  name="nickname"
                  control={control}
                  label={t('nickname')}
                />
              </StyledController>
              <StyledController>
                <InputController
                  fullWidth
                  name="secretUserId"
                  control={control}
                  label={t('secretUserId')}
                />
              </StyledController>
            </form>
            {error && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
