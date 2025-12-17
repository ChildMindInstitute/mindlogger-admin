import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { InputController } from 'shared/components/FormComponents';

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
import { useMFASessionExpiry } from './useMFASessionExpiry';

interface MFAFormData {
  totpCode: string;
}

interface MFAFormProps {
  onSwitchToRecovery?: () => void;
}

export const MFAForm = ({ onSwitchToRecovery }: MFAFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sessionRedirectTimeoutRef = useRef<number>();
  const hasSessionExpiredRef = useRef(false);

  const { mfaSession, authentication } = useAppSelector((state) => state.auth);
  const attempts = mfaSession?.attempts || 0;
  const maxAttempts = 5;

  const { handleSubmit, control, setValue, watch } = useForm<MFAFormData>({
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
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [totpCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSessionExpired = useCallback(() => {
    if (hasSessionExpiredRef.current) return;
    hasSessionExpiredRef.current = true;

    setErrorMessage(t('mfaSessionExpired'));

    if (sessionRedirectTimeoutRef.current) {
      clearTimeout(sessionRedirectTimeoutRef.current);
    }

    sessionRedirectTimeoutRef.current = window.setTimeout(() => {
      dispatch(auth.actions.clearMFASession());
      navigate('/login');
    }, 3000);
  }, [dispatch, navigate, t]);

  useMFASessionExpiry({ mfaSession, onExpire: handleSessionExpired });

  useEffect(
    () => () => {
      if (sessionRedirectTimeoutRef.current) {
        clearTimeout(sessionRedirectTimeoutRef.current);
      }
      hasSessionExpiredRef.current = false;
    },
    [],
  );

  const onSubmit = async (data: MFAFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { verifyMFATOTP } = auth.thunk;
    const result = await dispatch(verifyMFATOTP({ totpCode: data.totpCode }));

    if (verifyMFATOTP.fulfilled.match(result)) {
      navigateToLibrary(navigate);
    }

    if (verifyMFATOTP.rejected.match(result)) {
      const errorPayload = result.payload as { message?: string };
      const errorMsg =
        typeof errorPayload?.message === 'string'
          ? errorPayload.message
          : errorPayload || t('invalidMFACode');
      const errorMsgStr = typeof errorMsg === 'string' ? errorMsg : t('invalidMFACode');

      // Handle specific error cases
      if (errorMsgStr.includes('Invalid TOTP code')) {
        setErrorMessage(t('invalidCode'));
        setValue('totpCode', '');
      } else if (errorMsgStr.includes('Too many attempts')) {
        setErrorMessage(t('tooManyAttempts'));
        setTimeout(() => {
          dispatch(auth.actions.clearMFASession());
          navigate('/login');
        }, 3000);
      } else if (errorMsgStr.includes('expired')) {
        handleSessionExpired();
      } else {
        setErrorMessage(errorMsgStr);
      }
    }

    setIsSubmitting(false);
  };

  const handleRecoveryClick = () => {
    if (onSwitchToRecovery) {
      onSwitchToRecovery();
    }
  };

  const handleCodeChange = (
    _event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    handleChange: () => void,
  ) => {
    if (errorMessage) {
      setErrorMessage('');
    }
    handleChange();
  };

  // Show warning after 3 attempts
  const showWarning = attempts >= 3 && attempts < maxAttempts;

  return (
    <StyledMFAContainer>
      <StyledMFAForm ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledMFAHeadline>{t('confirmYourIdentity')}</StyledMFAHeadline>
        <StyledMFASubheader>{t('enterVerificationCode')}</StyledMFASubheader>

        <StyledMFAController>
          <InputController
            fullWidth
            name="totpCode"
            control={control}
            label={t('enterVerificationCodePlaceholder')}
            placeholder=""
            onChange={handleCodeChange}
            inputProps={{
              maxLength: 6,
              inputMode: 'numeric',
              pattern: '[0-9]*',
              autoComplete: 'one-time-code',
              style: { letterSpacing: '0.5em', fontSize: '1.25rem' },
            }}
            autoFocus
            error={!!errorMessage || showWarning}
            helperText={
              errorMessage ||
              (showWarning && t('attemptsRemaining', { count: maxAttempts - attempts }))
            }
            data-testid="mfa-form-code"
          />
        </StyledMFAController>

        <StyledMFALink onClick={handleRecoveryClick} data-testid="mfa-form-recovery-link">
          {t('cantAccessAuthenticator')}
        </StyledMFALink>

        <StyledMFAButton
          variant="contained"
          type="submit"
          disabled={isSubmitting || authentication.status === 'loading'}
          data-testid="mfa-form-submit"
        >
          {t('continue')}
        </StyledMFAButton>
      </StyledMFAForm>
    </StyledMFAContainer>
  );
};
