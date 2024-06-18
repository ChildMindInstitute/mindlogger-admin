import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, ToggleButtonGroup, ToggleButtonVariants } from 'shared/components';
import { StyledErrorText, StyledFlexEnd, StyledModalWrapper } from 'shared/styles';
import { useFormError } from 'modules/Dashboard/hooks';
import { NON_UNIQUE_VALUE_MESSAGE, Roles } from 'shared/consts';
import { Mixpanel, getErrorMessage } from 'shared/utils';
import { Languages, postAppletInvitationApi, postAppletShellAccountApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks';
import { banners } from 'redux/modules';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';

import {
  RESPONDENT_ALREADY_INVITED,
  defaultValues,
  toggleButtons,
} from './AddParticipantPopup.const';
import { AddParticipantPopupSchema } from './AddParticipantPopup.schema';
import {
  AddParticipantPopupProps,
  AddParticipantFormValues,
  AddParticipantSteps,
  Fields,
} from './AddParticipantPopup.types';
import { PublicLinkPopup } from './PublicLinkPopup';
import { PublicLinkToggle } from './PublicLinkToggle';
import { AddParticipantForm } from './AddParticipantForm';

export const AddParticipantPopup = ({
  popupVisible,
  appletId,
  onClose,
  'data-testid': dataTestid,
}: AddParticipantPopupProps) => {
  const { t, i18n } = useTranslation('app');
  const defaults = {
    ...defaultValues,
    language: i18n.language as Languages,
  };
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isValid, isDirty },
  } = useForm<AddParticipantFormValues>({
    resolver: yupResolver(AddParticipantPopupSchema()),
    defaultValues: defaults,
    mode: 'onBlur',
  });
  const accountType = useWatch({ control, name: 'accountType' });
  const isFullAccount = accountType === AccountType.Full;
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(AddParticipantSteps.AccountType);
  const [hasCommonError, setHasCommonError] = useState(false);
  const [publicLinkDialogOpen, setPublicLinkDialogOpen] = useState(false);
  const [hasPublicLink, setHasPublicLink] = useState(false);
  const [refetchOnClose, setRefetchOnClose] = useState(false);

  const handleClose = (shouldRefetch = false) => {
    resetForm();
    setHasCommonError(false);
    onClose?.(shouldRefetch);
  };

  const resetForm = () => reset({ ...defaults, accountType });

  const {
    error: invitationError,
    execute: createInvitation,
    isLoading: isInvitationLoading,
  } = useAsync(postAppletInvitationApi, async ({ data }) => {
    dispatch(
      banners.actions.addBanner({
        key: 'AddParticipantSuccessBanner',
        bannerProps: {
          accountType: AccountType.Full,
          id: data?.result?.secretUserId,
        },
      }),
    );

    Mixpanel.track('Full Account invitation created successfully', {
      applet_id: appletId,
      tag: data?.result?.tag || null, // Normalize empty string tag to null
    });

    handleClose(true);
  });
  const {
    error: shellAccountError,
    execute: createShellAccount,
    isLoading: isShellAccountLoading,
  } = useAsync(postAppletShellAccountApi, async ({ data }) => {
    dispatch(
      banners.actions.addBanner({
        key: 'AddParticipantSuccessBanner',
        bannerProps: {
          accountType: AccountType.Limited,
          id: data?.result?.secretUserId,
        },
      }),
    );

    Mixpanel.track('Limited Account created successfully', {
      applet_id: appletId,
      tag: data?.result?.tag || null, // Normalize empty string tag to null
    });

    handleClose(true);
  });
  const isLoading = isInvitationLoading || isShellAccountLoading;

  const handleNext = () => {
    setStep(AddParticipantSteps.AccountForm);
    resetForm();
  };

  const handleSubmitForm = (values: AddParticipantFormValues) => {
    if (!appletId) return;

    const { email, nickname, tag, ...rest } = values;

    if (isFullAccount) {
      Mixpanel.track('Full Account invitation form submitted', {
        applet_id: appletId,
        tag: tag || null, // Normalize empty string tag to null
      });

      createInvitation({
        url: 'respondent',
        appletId,
        options: {
          email: String(email),
          nickname: String(nickname),
          role: Roles.Respondent,
          workspacePrefix: '',
          subjects: [],
          tag,
          ...rest,
        },
      });
    } else {
      Mixpanel.track('Add Limited Account form submitted', {
        applet_id: appletId,
        tag: tag || null, // Normalize empty string tag to null
      });

      createShellAccount({
        appletId,
        options: {
          email: email || null,
          nickname,
          tag,
          ...rest,
        },
      });
    }
  };

  const handleBack = () => {
    setStep(AddParticipantSteps.AccountType);
  };

  const error = invitationError || shellAccountError;
  useFormError({
    error,
    setError,
    setHasCommonError,
    fields: Fields,
    customFieldErrors: [
      {
        fieldName: Fields.secretUserId,
        apiMessage: NON_UNIQUE_VALUE_MESSAGE,
        errorMessage: t('secretUserIdExists'),
      },
      {
        fieldName: Fields.email,
        apiMessage: RESPONDENT_ALREADY_INVITED,
        errorMessage: t('participantAlreadyInvited'),
      },
    ],
  });

  switch (step) {
    case AddParticipantSteps.AccountType:
      return (
        <>
          <Modal
            hasActions={false}
            open={popupVisible && !publicLinkDialogOpen}
            width="73.6"
            onClose={() => handleClose(refetchOnClose)}
            onBackdropClick={null}
            footer={
              <StyledFlexEnd sx={{ width: '100%' }}>
                <Button onClick={handleNext} variant="contained">
                  {t('next')}
                </Button>
              </StyledFlexEnd>
            }
            title={t('addParticipant')}
            data-testid={dataTestid}
          >
            <StyledModalWrapper sx={{ display: 'flex', flexDirection: 'column', gap: 2.6 }}>
              <Controller
                name="accountType"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ToggleButtonGroup
                    toggleButtons={toggleButtons}
                    variant={ToggleButtonVariants.Large}
                    activeButton={value}
                    setActiveButton={onChange}
                    data-testid={`${dataTestid}-account-type`}
                  />
                )}
              />

              <PublicLinkToggle
                appletId={appletId}
                onConfirmPublicLink={(hasLink = false) => {
                  setPublicLinkDialogOpen(true);
                  setHasPublicLink(hasLink);
                }}
              />
            </StyledModalWrapper>
          </Modal>

          <PublicLinkPopup
            appletId={appletId}
            hasPublicLink={hasPublicLink}
            open={publicLinkDialogOpen}
            onClose={(shouldRefetch = false) => {
              setPublicLinkDialogOpen(false);

              if (!refetchOnClose) {
                setRefetchOnClose(shouldRefetch);
              }
            }}
          />
        </>
      );

    case AddParticipantSteps.AccountForm:
      return (
        <Modal
          open={popupVisible}
          width="73.6"
          onClose={() => handleClose(refetchOnClose)}
          onBackdropClick={null}
          onSubmit={handleSubmit(handleSubmitForm)}
          title={t(isFullAccount ? 'fullAccount' : 'limitedAccount')}
          buttonText={t(isFullAccount ? 'sendInvitation' : 'create')}
          disabledSubmit={!isValid}
          hasSecondBtn
          secondBtnText={t('Reset')}
          secondBtnVariant="tonal"
          onSecondBtnSubmit={resetForm}
          disabledSecondBtn={!isDirty}
          hasLeftBtn
          leftBtnText={t('back')}
          onLeftBtnSubmit={handleBack}
          data-testid={`${dataTestid}-account-form`}
        >
          <StyledModalWrapper>
            {isLoading && <Spinner />}
            <AddParticipantForm
              control={control}
              accountType={accountType}
              onSubmit={handleSubmit(handleSubmitForm)}
              data-testid={dataTestid}
            />
            {hasCommonError && (
              <StyledErrorText sx={{ mt: 2 }}>{getErrorMessage(error)}</StyledErrorText>
            )}
          </StyledModalWrapper>
        </Modal>
      );
  }
};
