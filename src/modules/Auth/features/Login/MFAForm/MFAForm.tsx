import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';

import { mfaFormSchema } from './MFAForm.schema';
import {
  StyledMFAContainer,
  StyledMFAForm,
  StyledMFAHeadline,
  StyledMFASubheader,
  StyledMFAController,
  StyledMFALink,
  StyledMFAButton,
} from './MFAForm.styles';
import { useMFAVerification } from './useMFAVerification';

interface MFAFormData {
  totpCode: string;
}

interface MFAFormProps {
  onSwitchToRecovery?: () => void;
  onBackToLogin?: () => void;
}

export const MFAForm = ({ onSwitchToRecovery, onBackToLogin }: MFAFormProps) => {
  const { t } = useTranslation('app');
  const formRef = useRef<HTMLFormElement>(null);

  const {
    error,
    displayError,
    isSubmitting,
    attempts,
    maxAttempts,
    verifyCode,
    clearError,
    cleanup,
  } = useMFAVerification('totp');

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MFAFormData>({
    resolver: yupResolver(mfaFormSchema()),
    defaultValues: {
      totpCode: '',
    },
  });

  const totpCode = watch('totpCode');

  // Auto-submit when user enters 6 digits
  useEffect(() => {
    if (totpCode.length === 6 && /^\d{6}$/.test(totpCode) && !isSubmitting) {
      formRef.current?.requestSubmit();
    }
  }, [totpCode, isSubmitting]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && totpCode.length > 0) {
      clearError();
    }
  }, [totpCode, error, clearError]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const onSubmit = async (data: MFAFormData) => {
    const success = await verifyCode(data.totpCode);
    if (!success) {
      // Clear the input on error so user can try again
      setValue('totpCode', '');
    }
  };

  const handleRecoveryClick = () => {
    if (onSwitchToRecovery) {
      onSwitchToRecovery();
    }
  };

  const handleCodeChange = (value: string, handleChange: (value: string) => void) => {
    handleChange(value);
  };

  // Show warning after 3 attempts
  const showWarning = attempts >= 3 && attempts < maxAttempts;
  const fieldError = errors.totpCode?.message as string | undefined;
  const warningMessage = showWarning
    ? t('attemptsRemaining', { count: maxAttempts - attempts })
    : undefined;
  const primaryError = displayError || fieldError;
  const helperMessages = [primaryError, warningMessage].filter(Boolean);
  const helperMessage = helperMessages.join(' ');
  const hasError = helperMessages.length > 0;

  return (
    <StyledMFAContainer>
      <StyledMFAForm ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledMFAHeadline>{t('confirmYourIdentity')}</StyledMFAHeadline>
        <StyledMFASubheader>{t('enterVerificationCode')}</StyledMFASubheader>

        <StyledMFAController>
          <Controller
            name="totpCode"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                fullWidth
                label={t('enterVerificationCodePlaceholder')}
                placeholder=""
                value={value}
                onChange={(e) => {
                  handleCodeChange(e.target.value, onChange);
                }}
                onBlur={onBlur}
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  autoComplete: 'one-time-code',
                  style: { letterSpacing: '0.5em', fontSize: '1.25rem' },
                }}
                autoFocus
                error={hasError}
                helperText={helperMessage}
                data-testid="mfa-form-code"
              />
            )}
          />
        </StyledMFAController>

        <StyledMFALink onClick={handleRecoveryClick} data-testid="mfa-form-recovery-link">
          {t('cantAccessAuthenticator')}
        </StyledMFALink>

        <StyledMFAButton
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          data-testid="mfa-form-submit"
        >
          {t('continue')}
        </StyledMFAButton>

        {onBackToLogin && (
          <StyledMFALink
            onClick={onBackToLogin}
            data-testid="mfa-form-back-link"
            style={{ marginTop: '16px' }}
          >
            {t('backToLogin')}
          </StyledMFALink>
        )}
      </StyledMFAForm>
    </StyledMFAContainer>
  );
};
