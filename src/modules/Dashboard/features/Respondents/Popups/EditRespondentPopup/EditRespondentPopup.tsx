import { useState, ChangeEvent } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType, Svg } from 'shared/components';
import { PARTICIPANT_TAG_ICONS, USER_SELECTABLE_PARTICIPANT_TAGS } from 'shared/consts';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { InputController, SelectController } from 'shared/components/FormComponents';
import { MixpanelProps, Mixpanel, getErrorMessage, MixpanelEventType } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';
import { useEditSubjectMutation } from 'modules/Dashboard/api/apiSlice';

import { EditRespondentForm, EditRespondentPopupProps } from './EditRespondentPopup.types';
import { editRespondentFormSchema } from './EditRespondentPopup.schema';

export const EditRespondentPopup = ({
  popupVisible,
  onClose,
  chosenAppletData,
}: EditRespondentPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isTeamMember = chosenAppletData?.subjectTag === 'Team';

  const [isServerErrorVisible, setIsServerErrorVisible] = useState(true);

  const { handleSubmit, control, setValue, getValues, trigger } = useForm<EditRespondentForm>({
    resolver: yupResolver(editRespondentFormSchema()),
    defaultValues: {
      secretUserId: chosenAppletData?.respondentSecretId ?? '',
      nickname: chosenAppletData?.respondentNickname ?? '',
      tag: chosenAppletData?.subjectTag ?? ('' as const),
    },
  });

  const dataTestid = 'dashboard-respondents-edit-popup';

  const [editRespondent, { isLoading, error }] = useEditSubjectMutation();

  const submitForm = async () => {
    if (!chosenAppletData) return;

    const { secretUserId, nickname, tag } = getValues();
    const { appletId, respondentId, subjectId } = chosenAppletData;

    Mixpanel.track({
      action: respondentId
        ? MixpanelEventType.EditFullAccountFormSubmitted
        : MixpanelEventType.EditLimitedAccountFormSubmitted,
      [MixpanelProps.AppletId]: appletId,
      [MixpanelProps.Tag]: tag || null, // Normalize empty string tag to null
    });

    const response = await editRespondent({
      values: {
        secretUserId: secretUserId.trim(),
        nickname: nickname?.trim(),
        ...(tag && { tag }),
      },
      subjectId,
    });

    if ('data' in response) {
      const { userId, appletId, tag } = response.data.result ?? {};
      Mixpanel.track({
        action: userId
          ? MixpanelEventType.FullAccountEditedSuccessfully
          : MixpanelEventType.LimitedAccountEditedSuccessfully,
        [MixpanelProps.AppletId]: appletId,
        [MixpanelProps.Tag]: tag || null, // Normalize empty string tag to null
      });

      onClose();
      dispatch(banners.actions.addBanner({ key: 'SaveSuccessBanner' }));
    } else {
      setIsServerErrorVisible(true);
    }
  };

  const handleChangeSecretId = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue('secretUserId', event.target.value);
    setIsServerErrorVisible(false);
    trigger('secretUserId');
  };

  const hasServerError = error && isServerErrorVisible;

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={handleSubmit(submitForm)}
      disabledSubmit={isLoading}
      title={t('editParticipant')}
      buttonText={t('save')}
      hasLeftBtn
      onLeftBtnSubmit={onClose}
      leftBtnText={t('cancel')}
      data-testid={dataTestid}
      width="56"
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.4 }}
            onSubmit={handleSubmit(submitForm)}
            noValidate
          >
            <InputController
              fullWidth
              name="nickname"
              control={control}
              label={t('nickname')}
              data-testid={`${dataTestid}-nickname`}
            />

            <InputController
              fullWidth
              name="secretUserId"
              control={control}
              label={t('secretUserId')}
              onChange={handleChangeSecretId}
              error={!!hasServerError}
              data-testid={`${dataTestid}-secret-user-id`}
            />

            <SelectController
              InputLabelProps={{ shrink: true }}
              control={control}
              disabled={isTeamMember}
              data-testid={`${dataTestid}-tag`}
              fullWidth
              label={t('tag')}
              name="tag"
              options={
                isTeamMember
                  ? [
                      {
                        labelKey: `participantTag.Team`,
                        value: 'Team',
                        icon: <Svg id="team-outlined" width={24} height={24} />,
                      },
                    ]
                  : USER_SELECTABLE_PARTICIPANT_TAGS.map((tag) => ({
                      labelKey: `participantTag.${tag}`,
                      value: tag,
                      icon: <Svg id={PARTICIPANT_TAG_ICONS[tag]} width={24} height={24} />,
                    }))
              }
              placeholder={t('selectOne')}
              withChecked
            />

            {hasServerError && <StyledErrorText>{getErrorMessage(error)}</StyledErrorText>}
          </Box>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
