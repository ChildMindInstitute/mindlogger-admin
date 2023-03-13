import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { InputController } from 'shared/components/FormComponents';

import { EditRespondentForm, EditRespondentPopupProps } from './EditRespondentPopup.types';
import { editRespondentFormSchema } from './EditRespondentPopup.schema';
import { StyledController } from './EditRespondentsPopup.styles';

export const EditRespondentPopup = ({
  popupVisible,
  setPopupVisible,
  chosenAppletData,
  setChosenAppletData,
}: EditRespondentPopupProps) => {
  const { t } = useTranslation('app');

  const { handleSubmit, control, setValue } = useForm<EditRespondentForm>({
    resolver: yupResolver(editRespondentFormSchema()),
    defaultValues: { MRN: '', nickName: '' },
  });

  const submitForm = () => {
    // TODO: when the endpoint is ready, make a request
  };

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  useEffect(() => {
    const { nickName = '', secretUserId = '' } = chosenAppletData || {};
    setValue('MRN', secretUserId);
    setValue('nickName', nickName);
  }, [chosenAppletData]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handleSubmit(submitForm)}
      title={t('editRespondent')}
      buttonText={t('save')}
      hasSecondBtn
      onSecondBtnSubmit={handlePopupClose}
      secondBtnText={t('cancel')}
    >
      <StyledModalWrapper>
        <form onSubmit={handleSubmit(submitForm)} noValidate>
          <StyledController>
            <InputController fullWidth name="nickName" control={control} label={t('nickname')} />
          </StyledController>
          <StyledController>
            <InputController fullWidth name="MRN" control={control} label={t('secretUserId')} />
          </StyledController>
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
