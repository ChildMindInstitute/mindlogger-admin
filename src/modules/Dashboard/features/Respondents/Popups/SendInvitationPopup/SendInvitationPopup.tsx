import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage, Mixpanel, MixpanelEventType } from 'shared/utils';
import { useAsync } from 'shared/hooks/useAsync';
import { postSubjectInvitationApi } from 'api';
import { InputController } from 'shared/components/FormComponents';
import { useFormError } from 'modules/Dashboard/hooks';

import { AppletsSmallTable } from '../../AppletsSmallTable';
import { SendInvitationForm, SendInvitationPopupProps } from './SendInvitationPopup.types';
import { dataTestId, RESPONDENT_ALREADY_INVITED } from './SendInvitationPopup.const';
import { SendInvitationSchema } from './SendInvitation.schema';

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

  const { execute, error, isLoading } = useAsync(postSubjectInvitationApi, () => {
    setChosenAppletData(null);
    onClose(true);
  });

  const handlePopupClose = () => {
    setChosenAppletData(null);
    onClose(false);
  };

  const submitForm = () => {
    if (!appletId || !subjectId) return;
    Mixpanel.track(MixpanelEventType.SubjectInvitationClick);
    setHasCommonError(false);
    execute({ appletId, subjectId, email: getValues('email') });
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
                <StyledBodyLarge
                  color={variables.palette.semantic.error}
                  sx={{ m: theme.spacing(1, 0) }}
                >
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
