import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'shared/components';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { useAsync } from 'shared/hooks';
import { editRespondentAccess } from 'api';
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

  const { handleSubmit, control, setValue, getValues } = useForm<EditRespondentForm>({
    resolver: yupResolver(editRespondentFormSchema()),
    defaultValues: { secretUserId: '', nickname: '' },
  });

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const { execute, error } = useAsync(editRespondentAccess, () => {
    handlePopupClose();
    refetchRespondents();
  });

  const submitForm = () => {
    if (!chosenAppletData) return;

    const values = getValues();
    const { appletId, ownerId, respondentId } = chosenAppletData;

    execute({
      values,
      appletId,
      ownerId,
      respondentId,
    });
  };

  useEffect(() => {
    const { nickname = '', secretUserId = '' } = chosenAppletData || {};
    setValue('secretUserId', secretUserId);
    setValue('nickname', nickname);
  }, [chosenAppletData]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={t('editRespondent')}
      buttonText={t('save')}
      hasSecondBtn
      onSecondBtnSubmit={handlePopupClose}
      secondBtnText={t('cancel')}
    >
      <StyledModalWrapper>
        <form onSubmit={handleSubmit(submitForm)} noValidate>
          <StyledController>
            <InputController fullWidth name="nickname" control={control} label={t('nickname')} />
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
      </StyledModalWrapper>
    </Modal>
  );
};
