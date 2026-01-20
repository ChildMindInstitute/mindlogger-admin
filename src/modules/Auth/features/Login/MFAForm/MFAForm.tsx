import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, TextField } from '@mui/material';

import { StyledBodyMedium, StyledHeadlineSmall, StyledLinkBtn, variables } from 'shared/styles';

import { mfaFormSchema } from './MFAForm.schema';
import { StyledMFAContainer, StyledMFAForm, StyledMFAButton } from './MFAForm.styles';
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
  const { error, displayError, isSessionExpired, isSubmitting, verifyCode, clearError } =
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
    if (totpCode.length === 6 && /^\d{6}$/.test(totpCode) && !isSubmitting && !isSessionExpired) {
      formRef.current?.requestSubmit();
    }
  }, [totpCode, isSubmitting, isSessionExpired]);

  // Clear error only when user is actually typing
  useEffect(() => {
    if (error && totpCode.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [totpCode, error, clearError]);

  const onSubmit = async (data: MFAFormData) => {
    if (isSessionExpired) return;
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

  return (
    <StyledMFAContainer>
      <StyledMFAForm ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadlineSmall sx={{ textAlign: 'center', color: variables.palette.on_surface }}>
          {t('confirmYourIdentity')}
        </StyledHeadlineSmall>
        <StyledBodyMedium
          sx={{ textAlign: 'center', margin: 0, color: variables.palette.on_surface_variant }}
        >
          {t('enterVerificationCode')}
        </StyledBodyMedium>

        <Box sx={{ width: '100%' }}>
          <Controller
            name="totpCode"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                fullWidth
                label={!isSessionExpired && t('enterVerificationCodePlaceholder')}
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
                }}
                autoFocus
                disabled={isSessionExpired}
                error={hasError}
                helperText={helperMessage}
                data-testid="mfa-form-code"
              />
            )}
          />
        </Box>

        <StyledMFAButton
          variant="contained"
          type="submit"
          disabled={isSubmitting || isSessionExpired}
          data-testid="mfa-form-submit"
        >
          {t('continue')}
        </StyledMFAButton>

        <StyledLinkBtn
          onClick={handleRecoveryClick}
          disabled={isSubmitting || isSessionExpired}
          data-testid="mfa-form-recovery-link"
          sx={{ textDecoration: 'none', mt: 1.2, mb: 0.8 }}
        >
          {t('cantAccessAuthenticator')}
        </StyledLinkBtn>

        {onBackToLogin && (
          <StyledLinkBtn
            onClick={onBackToLogin}
            data-testid="mfa-form-back-link"
            sx={{ textDecoration: 'none', mt: 2 }}
          >
            {t('backToLogin')}
          </StyledLinkBtn>
        )}
      </StyledMFAForm>
    </StyledMFAContainer>
  );
};

export const MFAForm = memo(MFAFormComponent);
MFAForm.displayName = 'MFAForm';
