import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCreateSubjectInvitationMutation } from 'modules/Dashboard/api/apiSlice';
import { useFormError } from 'modules/Dashboard/hooks';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage, Mixpanel, MixpanelEventType } from 'shared/utils';

import { AppletsSmallTable } from '../../AppletsSmallTable';
import { SendInvitationSchema } from './SendInvitation.schema';
import { dataTestId, RESPONDENT_ALREADY_INVITED } from './SendInvitationPopup.const';
import { SendInvitationForm, SendInvitationPopupProps } from './SendInvitationPopup.types';

export const SendInvitationPopup = ({
  popupVisible,
  onClose,
  chosenAppletData,
  setChosenAppletData,
  tableRows,
  email,
}: SendInvitationPopupProps) => {
  const { t } = useTranslation('app');
  const { respondentSecretId = '', subjectId, appletId } = chosenAppletData || {};
  const showSecondScreen = !!chosenAppletData;
  const [hasCommonError, setHasCommonError] = useState(false);
  const { handleSubmit, control, getValues, setError } = useForm<SendInvitationForm>({
    resolver: yupResolver(SendInvitationSchema()),
    defaultValues: { email: email || '' },
  });

  const [execute, { error, isLoading }] = useCreateSubjectInvitationMutation();

  const handlePopupClose = () => {
    setChosenAppletData(null);
    onClose();
  };

  const submitForm = async () => {
    if (!appletId || !subjectId) return;
    Mixpanel.track({ action: MixpanelEventType.SubjectInvitationClick });
    setHasCommonError(false);

    const response = await execute({ appletId, subjectId, email: getValues('email') });

    if ('data' in response) {
      handlePopupClose();
    }
  };

  const getTitle = () => {
    if (showSecondScreen) {
      return `${t(email ? 'confirmEmailForId' : 'addEmailForId')} ${respondentSecretId}`;
    }

    return t('sendInvitation');
  };

  useFormError({
    error,
    setError,
    setHasCommonError,
    fields: { email: 'email' },
    customFieldErrors: [
      {
        fieldName: 'email',
        apiMessage: RESPONDENT_ALREADY_INVITED,
        errorMessage: t('respondentAlreadyInvited'),
      },
    ],
  });

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handleSubmit(submitForm)}
      title={getTitle()}
      buttonText={showSecondScreen ? t('sendInvitation') : ''}
      disabledSubmit={isLoading}
      data-testid={dataTestId}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          {showSecondScreen ? (
            <>
              <form onSubmit={handleSubmit(submitForm)} noValidate>
                <InputController
                  fullWidth
                  name="email"
                  control={control}
                  label={t('emailAddress')}
                />
              </form>
              {hasCommonError && (
                <StyledBodyLarge color={variables.palette.error} sx={{ m: theme.spacing(1, 0) }}>
                  {getErrorMessage(error)}
                </StyledBodyLarge>
              )}
            </>
          ) : (
            <>
              <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
                {t('pleaseSelectAppletToInvite')}
              </StyledBodyLarge>
              <AppletsSmallTable tableRows={tableRows} />
            </>
          )}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
