import { useEffect, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { useAsync } from 'shared/hooks/useAsync';
import { editSubjectApi } from 'api';
import { falseReturnFunc, getErrorMessage } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';

import { EditRespondentForm, EditRespondentPopupProps } from './EditRespondentPopup.types';
import { editRespondentFormSchema } from './EditRespondentPopup.schema';
import { StyledController } from './EditRespondentsPopup.styles';

export const EditRespondentPopup = ({
  popupVisible,
  onClose,
  chosenAppletData,
}: EditRespondentPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const [isServerErrorVisible, setIsServerErrorVisible] = useState(true);

  const onCloseHandler = (shouldRefetch = false) => onClose(shouldRefetch);

  const { handleSubmit, control, setValue, getValues, trigger } = useForm<EditRespondentForm>({
    resolver: yupResolver(editRespondentFormSchema()),
    defaultValues: { secretUserId: '', nickname: '' },
  });

  const dataTestid = 'dashboard-respondents-edit-popup';

  const {
    execute: editRespondent,
    isLoading,
    error,
  } = useAsync(
    editSubjectApi,
    () => {
      onCloseHandler(true);
      dispatch(banners.actions.addBanner({ key: 'SaveSuccessBanner' }));
    },
    falseReturnFunc,
    () => {
      setIsServerErrorVisible(true);
    },
  );

  const submitForm = () => {
    if (!chosenAppletData) return;

    const { secretUserId, nickname } = getValues();
    const { subjectId } = chosenAppletData;

    editRespondent({
      values: {
        secretUserId: secretUserId.trim(),
        nickname: nickname?.trim(),
      },
      subjectId,
    });
  };

  const handleChangeSecretId = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('secretUserId', event.target.value);
    setIsServerErrorVisible(false);
    trigger('secretUserId');
  };

  useEffect(() => {
    const { respondentNickname, respondentSecretId = '' } = chosenAppletData || {};
    setValue('secretUserId', respondentSecretId);
    setValue('nickname', respondentNickname || '');
  }, [chosenAppletData]);

  const hasServerError = error && isServerErrorVisible;

  return (
    <Modal
      open={popupVisible}
      onClose={onCloseHandler}
      onSubmit={handleSubmit(submitForm)}
      disabledSubmit={isLoading}
      title={t('editRespondent')}
      buttonText={t('save')}
      hasSecondBtn
      onSecondBtnSubmit={onCloseHandler}
      secondBtnText={t('cancel')}
      data-testid={dataTestid}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <form onSubmit={handleSubmit(submitForm)} noValidate>
            <StyledController>
              <InputController
                fullWidth
                name="nickname"
                control={control}
                label={t('nickname')}
                data-testid={`${dataTestid}-nickname`}
              />
            </StyledController>
            <StyledController>
              <InputController
                fullWidth
                name="secretUserId"
                control={control}
                label={t('secretUserId')}
                onChange={handleChangeSecretId}
                error={!!hasServerError}
                data-testid={`${dataTestid}-secret-user-id`}
              />
            </StyledController>
          </form>
          {hasServerError && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
