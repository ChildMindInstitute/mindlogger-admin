import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType, SubmitBtnVariant } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage, Mixpanel } from 'shared/utils';
import { useAsync } from 'shared/hooks/useAsync';
import { postSubjectInvitationApi } from 'api';
import { InputController } from 'shared/components/FormComponents';
import { useFormError } from 'modules/Dashboard/hooks';

import { SendInvitationForm, SendInvitationPopupProps } from './SendInvitationPopup.types';
import { dataTestId } from './SendInvitationPopup.const';
import { SendInvitationSchema } from './SendInvitation.schema';

export const SendInvitationPopup = ({
  open,
  onClose,
  secretUserId,
  subjectId,
  email,
}: SendInvitationPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const [hasCommonError, setHasCommonError] = useState(false);
  const { handleSubmit, control, getValues, setError } = useForm<SendInvitationForm>({
    resolver: yupResolver(SendInvitationSchema()),
    defaultValues: { email: email || '' },
  });

  const { execute, error, isLoading } = useAsync(postSubjectInvitationApi, () => {
    onClose(true);
  });

  const submitForm = () => {
    if (!appletId || !subjectId) return;
    Mixpanel.track('Subject Invitation click');
    setHasCommonError(false);
    execute({ appletId, subjectId, email: getValues('email') });
  };

  useFormError({ error, setError, setHasCommonError, fields: { email: 'email' } });

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      onSubmit={handleSubmit(submitForm)}
      title={`${t(email ? 'confirmEmailForId' : 'addEmailForId')} ${secretUserId}`}
      buttonText={t('sendInvitation')}
      disabledSubmit={isLoading}
      submitBtnVariant={SubmitBtnVariant.Contained}
      data-testid={dataTestId}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <form onSubmit={handleSubmit(submitForm)} noValidate>
            <InputController fullWidth name="email" control={control} label={t('emailAddress')} />
          </form>
          {hasCommonError && (
            <StyledBodyLarge
              color={variables.palette.semantic.error}
              sx={{ m: theme.spacing(1, 0) }}
            >
              {getErrorMessage(error)}
            </StyledBodyLarge>
          )}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
