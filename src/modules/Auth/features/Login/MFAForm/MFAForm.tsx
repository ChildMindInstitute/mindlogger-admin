import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useEffect, useRef } from 'react';
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

const MFAFormComponent = ({ onSwitchToRecovery, onBackToLogin }: MFAFormProps) => {
  const { t } = useTranslation('app');
  const formRef = useRef<HTMLFormElement>(null);
  const isUserTypingRef = useRef(false);
  const sanitizeTotp = (raw: string) => raw.replace(/\D/g, '').slice(0, 6);
  const { error, displayError, isSubmitting, verifyCode, clearError, cleanup } =
    useMFAVerification('totp');

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

  // Clear error only when user is actually typing
  useEffect(() => {
    if (error && totpCode.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [totpCode, error, clearError]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const onSubmit = async (data: MFAFormData) => {
    isUserTypingRef.current = false; // Mark that we're not typing
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

  const handleCodeChange = (raw: string, handleChange: (value: string) => void) => {
    isUserTypingRef.current = true;
    const sanitized = sanitizeTotp(raw);
    handleChange(sanitized);
  };

  // Get error message from Redux state
  const getErrorMessage = () => {
    if (displayError) {
      // displayError format: "invalidCode" or "invalidCode|2" (with attempts)
      if (displayError.includes('|')) {
        const [key, remaining] = displayError.split('|');

        return `${t(key)}. ${t('attemptsRemaining', { count: parseInt(remaining) })}`;
      }

      // Translate the error key
      return t(displayError);
    }

    // Only show validation errors if no verification error
    return errors.totpCode?.message;
  };

  const helperMessage = getErrorMessage();
  const hasError = !!helperMessage;

  console.log(
    'MFAForm render - helperMessage:',
    helperMessage,
    'hasError:',
    hasError,
    'displayError:',
    displayError,
  );

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

export const MFAForm = memo(MFAFormComponent);
MFAForm.displayName = 'MFAForm';
