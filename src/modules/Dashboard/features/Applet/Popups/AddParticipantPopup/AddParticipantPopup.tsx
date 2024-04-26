import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, ToggleButtonGroup, ToggleButtonVariants } from 'shared/components';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { useFormError } from 'modules/Dashboard/hooks';
import { NON_UNIQUE_VALUE_MESSAGE, Roles, VALIDATION_DEBOUNCE_VALUE } from 'shared/consts';
import { Mixpanel, getErrorMessage } from 'shared/utils';
import { Languages, postAppletInvitationApi, postAppletShellAccountApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks';
import { banners } from 'redux/modules';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';
import { useMultiInformantParticipantPath } from 'shared/hooks/useMultiInformantParticipantPath';

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
    mode: 'all',
    delayError: VALIDATION_DEBOUNCE_VALUE,
  });
  const participantPath = useMultiInformantParticipantPath({ appletId });
  const accountType = useWatch({ control, name: 'accountType' });
  const isFullAccount = accountType === AccountType.Full;
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(AddParticipantSteps.AccountType);
  const [hasCommonError, setHasCommonError] = useState(false);

  const handleClose = (shouldRefetch = false) => {
    resetForm();
    setHasCommonError(false);
    onClose?.(shouldRefetch);
  };

  const handleAddViaCSV = () => {
    alert('TODO: Add via CSV');
  };

  const resetForm = () => reset({ ...defaults, accountType });

  const {
    error: invitationError,
    execute: createInvitation,
    isLoading: isInvitationLoading,
  } = useAsync(postAppletInvitationApi, async (result) => {
    dispatch(
      banners.actions.addBanner({
        key: 'AddParticipantSuccessBanner',
        bannerProps: {
          accountType: AccountType.Full,
          id: result.data?.result?.secretUserId,
        },
      }),
    );
    Mixpanel.track('Invitation sent successfully');
    handleClose(true);
  });
  const {
    error: shellAccountError,
    execute: createShellAccount,
    isLoading: isShellAccountLoading,
  } = useAsync(postAppletShellAccountApi, async (result) => {
    dispatch(
      banners.actions.addBanner({
        key: 'AddParticipantSuccessBanner',
        bannerProps: {
          accountType: AccountType.Limited,
          id: result.data?.result?.secretUserId,
        },
      }),
    );
    Mixpanel.track('Shell account created successfully');
    handleClose(true);
  });
  const isLoading = isInvitationLoading || isShellAccountLoading;

  const handleNext = () => {
    setStep(AddParticipantSteps.AccountForm);
    resetForm();
  };

  const handleSubmitForm = (values: AddParticipantFormValues) => {
    if (!appletId) return;

    const { email, nickname, ...rest } = values;

    if (isFullAccount) {
      Mixpanel.track('Invitation submitted click');

      createInvitation({
        url: 'respondent',
        appletId,
        options: {
          email: String(email),
          nickname: String(nickname),
          role: Roles.Respondent,
          workspacePrefix: '',
          subjects: [],
          ...rest,
        },
      });
    } else {
      Mixpanel.track('Shell account submitted click');

      createShellAccount({
        appletId,
        options: {
          email: email || null,
          nickname,
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
        <Modal
          open={popupVisible}
          width="73.6"
          onClose={() => handleClose(false)}
          onBackdropClick={null}
          onSubmit={handleNext}
          title={t('addParticipant')}
          buttonText={t('next')}
          hasLeftBtn
          leftBtnText={t('addViaCSV')}
          leftBtnVariant="outlined"
          onLeftBtnSubmit={handleAddViaCSV}
          data-testid={dataTestid}
        >
          <StyledModalWrapper>
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
          </StyledModalWrapper>
        </Modal>
      );

    case AddParticipantSteps.AccountForm:
      return (
        <Modal
          open={popupVisible}
          width="73.6"
          onClose={() => handleClose(false)}
          onBackdropClick={null}
          onSubmit={handleSubmit(handleSubmitForm)}
          title={t(isFullAccount ? 'fullAccount' : 'limitedAccount')}
          buttonText={t(isFullAccount ? 'sendInvitation' : 'create')}
          disabledSubmit={!isValid}
          hasSecondBtn
          // TODO: Update second button variant once 'tonal' variant added
          // https://mindlogger.atlassian.net/browse/M2-6071
          secondBtnText={t('Reset')}
          secondBtnVariant="outlined"
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
