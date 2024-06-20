import { useState, ChangeEvent } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType, Svg } from 'shared/components';
import { PARTICIPANT_TAG_ICONS, USER_SELECTABLE_PARTICIPANT_TAGS } from 'shared/consts';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { InputController, SelectController } from 'shared/components/FormComponents';
import { useAsync } from 'shared/hooks/useAsync';
import { editSubjectApi } from 'api';
import { MixProperties, Mixpanel, falseReturnFunc, getErrorMessage } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';

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

  const onCloseHandler = (shouldRefetch = false) => onClose(shouldRefetch);

  const { handleSubmit, control, setValue, getValues, trigger } = useForm<EditRespondentForm>({
    resolver: yupResolver(editRespondentFormSchema()),
    defaultValues: {
      secretUserId: chosenAppletData?.respondentSecretId ?? '',
      nickname: chosenAppletData?.respondentNickname ?? '',
      tag: chosenAppletData?.subjectTag ?? ('' as const),
    },
  });

  const dataTestid = 'dashboard-respondents-edit-popup';

  const {
    execute: editRespondent,
    isLoading,
    error,
  } = useAsync(
    editSubjectApi,
    ({ data }) => {
      const { respondentId, appletId, tag } = data?.result ?? {};
      const event = respondentId
        ? 'Full Account edited successfully'
        : 'Limited Account edited successfully';
      Mixpanel.track(event, {
        [MixProperties.AppletId]: appletId,
        [MixProperties.Tag]: tag || null, // Normalize empty string tag to null
      });

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

    const { secretUserId, nickname, tag } = getValues();
    const { appletId, respondentId, subjectId } = chosenAppletData;

    const event = respondentId
      ? 'Edit Full Account form submitted'
      : 'Edit Limited Account form submitted';
    Mixpanel.track(event, {
      [MixProperties.AppletId]: appletId,
      [MixProperties.Tag]: tag || null, // Normalize empty string tag to null
    });

    editRespondent({
      values: {
        secretUserId: secretUserId.trim(),
        nickname: nickname?.trim(),
        ...(tag && { tag }),
      },
      subjectId,
    });
  };

  const handleChangeSecretId = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('secretUserId', event.target.value);
    setIsServerErrorVisible(false);
    trigger('secretUserId');
  };

  const hasServerError = error && isServerErrorVisible;

  return (
    <Modal
      open={popupVisible}
      onClose={() => onCloseHandler(false)}
      onSubmit={handleSubmit(submitForm)}
      disabledSubmit={isLoading}
      title={t('editParticipant')}
      buttonText={t('save')}
      hasLeftBtn
      onLeftBtnSubmit={() => onCloseHandler(false)}
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
