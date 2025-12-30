import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';

import { recoveryCodeSchema } from './MFAForm.schema';
import {
  StyledMFAContainer,
  StyledMFAForm,
  StyledMFAHeadline,
  StyledMFASubheader,
  StyledMFAController,
  StyledMFAButton,
  StyledBackButton,
} from './MFAForm.styles';
import { useMFAVerification } from './useMFAVerification';

interface RecoveryCodeFormData {
  code: string;
}

interface RecoveryCodeFormProps {
  onSwitchToTOTP?: () => void;
  onBackToLogin?: () => void;
}

export const RecoveryCodeForm = ({ onSwitchToTOTP, onBackToLogin }: RecoveryCodeFormProps) => {
  const { t } = useTranslation('app');

  const { error, displayError, isSessionExpired, isSubmitting, verifyCode, clearError, cleanup } =
    useMFAVerification('recovery');
  const isUserTypingRef = useRef(false);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecoveryCodeFormData>({
    resolver: yupResolver(recoveryCodeSchema()),
    defaultValues: {
      code: '',
    },
  });

  const code = watch('code');

  // Clear error only when user is actually typing
  useEffect(() => {
    if (error && code.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [code, error, clearError]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const onSubmit = async (data: RecoveryCodeFormData) => {
    if (isSessionExpired) return;
    isUserTypingRef.current = false; // Mark that we're not typing
    const success = await verifyCode(data.code);
    if (!success) {
      // Clear the input on error so user can try again
      setValue('code', '');
    }
  };

  const handleBackToTOTP = () => {
    if (onSwitchToTOTP) {
      onSwitchToTOTP();
    }
  };

  // Auto-format recovery code input
  const formatRecoveryCode = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Add hyphen after 5 characters if needed
    if (cleaned.length > 5) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 10)}`;
    }

    return cleaned;
  };

  const handleCodeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void,
  ) => {
    isUserTypingRef.current = true; // Mark that user is typing
    const formatted = formatRecoveryCode(e.target.value);
    setValue('code', formatted);
    onChange(formatted);
  };

  const fieldError = errors.code?.message as string | undefined;
  const helperMessage = displayError ? t(displayError) : fieldError;
  const hasError = !!helperMessage;

  return (
    <StyledMFAContainer>
      <StyledMFAForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledMFAHeadline>{t('confirmYourIdentity')}</StyledMFAHeadline>
        <StyledMFASubheader>{t('enterAccountRecoveryCode')}</StyledMFASubheader>

        <StyledMFAController>
          <Controller
            name="code"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                fullWidth
                label={!isSessionExpired && 'recoveryCode'}
                placeholder=""
                value={value}
                onChange={(e) => handleCodeChange(e, onChange)}
                onBlur={onBlur}
                inputProps={{
                  maxLength: 11,
                  autoComplete: 'off',
                  style: { letterSpacing: '0.2em', fontSize: '1.1rem' },
                }}
                autoFocus
                disabled={isSessionExpired}
                error={hasError}
                helperText={helperMessage}
                data-testid="recovery-form-code"
              />
            )}
          />
        </StyledMFAController>

        <StyledMFAButton
          variant="contained"
          type="submit"
          disabled={isSubmitting || isSessionExpired}
          data-testid="recovery-form-submit"
        >
          {t('continue')}
        </StyledMFAButton>

        {!isSessionExpired && (
          <StyledBackButton
            variant="text"
            onClick={handleBackToTOTP}
            data-testid="recovery-form-back-button"
          >
            {t('back')}
          </StyledBackButton>
        )}

        {onBackToLogin && isSessionExpired && (
          <StyledBackButton
            variant="text"
            onClick={onBackToLogin}
            data-testid="recovery-form-login-button"
            style={{ marginTop: '8px' }}
          >
            {t('backToLogin')}
          </StyledBackButton>
        )}
      </StyledMFAForm>
    </StyledMFAContainer>
  );
};
