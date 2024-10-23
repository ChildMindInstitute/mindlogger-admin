import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner } from 'shared/components';
import {
  StyledBodyLarge,
  StyledErrorText,
  StyledFlexColumn,
  StyledModalWrapper,
} from 'shared/styles';
import { useFormError } from 'modules/Dashboard/hooks';
import { Mixpanel, MixpanelProps, getErrorMessage, MixpanelEventType } from 'shared/utils';
import { ApiLanguages, postSubjectInvitationApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks';
import { banners } from 'redux/modules';
import { AccountType } from 'modules/Dashboard/types';
import { ParticipantSnippet } from 'modules/Dashboard/components';

import { RESPONDENT_ALREADY_INVITED } from './UpgradeAccountPopup.const';
import { UpgradeAccountPopupSchema } from './UpgradeAccountPopup.schema';
import {
  UpgradeAccountPopupProps,
  UpgradeAccountFormValues,
  Fields,
} from './UpgradeAccountPopup.types';
import { UpgradeAccountForm } from './UpgradeAccountForm';

export const UpgradeAccountPopup = ({
  popupVisible,
  appletId,
  subjectId,
  secretId,
  nickname,
  tag,
  onClose,
  'data-testid': dataTestid,
}: UpgradeAccountPopupProps) => {
  const { t, i18n } = useTranslation('app');
  const defaultValues = {
    email: '',
    language: i18n.language as ApiLanguages,
  };
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isValid, isDirty },
  } = useForm<UpgradeAccountFormValues>({
    resolver: yupResolver(UpgradeAccountPopupSchema()),
    defaultValues,
    mode: 'onBlur',
  });
  const dispatch = useAppDispatch();
  const [hasCommonError, setHasCommonError] = useState(false);

  const handleClose = (shouldRefetch = false) => {
    resetForm();
    setHasCommonError(false);
    onClose?.(shouldRefetch);
  };

  const resetForm = () => reset(defaultValues);

  const {
    error,
    execute: createInvitation,
    isLoading,
  } = useAsync(postSubjectInvitationApi, async (result) => {
    dispatch(
      banners.actions.addBanner({
        key: 'AddParticipantSuccessBanner',
        bannerProps: {
          accountType: AccountType.Full,
          id: result.data?.result?.secretUserId,
        },
      }),
    );

    Mixpanel.track({
      action: MixpanelEventType.UpgradeToFullAccountInviteCreated,
      [MixpanelProps.AppletId]: appletId,
    });

    handleClose(true);
  });

  const handleSubmitForm = (values: UpgradeAccountFormValues) => {
    if (!appletId || !subjectId) return;

    Mixpanel.track({
      action: MixpanelEventType.UpgradeToFullAccountFormSubmitted,
      [MixpanelProps.AppletId]: appletId,
    });

    createInvitation({
      appletId,
      subjectId,
      ...values,
    });
  };

  useFormError({
    error,
    setError,
    setHasCommonError,
    fields: Fields,
    customFieldErrors: [
      {
        fieldName: Fields.email,
        apiMessage: RESPONDENT_ALREADY_INVITED,
        errorMessage: t('participantAlreadyInvited'),
      },
    ],
  });

  return (
    <Modal
      open={popupVisible}
      width="56"
      onClose={() => handleClose(false)}
      onSubmit={handleSubmit(handleSubmitForm)}
      title={t('upgradeToFullAccount')}
      buttonText={t('sendInvitation')}
      disabledSubmit={!isValid}
      hasLeftBtn
      leftBtnText={t('Reset')}
      leftBtnVariant="tonal"
      onLeftBtnSubmit={resetForm}
      disabledLeftBtn={!isDirty}
      data-testid={`${dataTestid}-account-form`}
    >
      <StyledModalWrapper>
        {isLoading && <Spinner />}
        <StyledFlexColumn sx={{ gap: 1, mb: 4 }}>
          <ParticipantSnippet secretId={secretId} nickname={nickname} tag={tag} />
          <StyledBodyLarge>{t('upgradeDescription')}</StyledBodyLarge>
        </StyledFlexColumn>
        <UpgradeAccountForm
          control={control}
          onSubmit={handleSubmit(handleSubmitForm)}
          data-testid={dataTestid}
        />
        {hasCommonError && (
          <StyledErrorText sx={{ mt: 2 }}>{getErrorMessage(error)}</StyledErrorText>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
