import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { InputController } from 'shared/components/FormComponents';
import { AUTH_BOX_WIDTH } from 'shared/consts';
import { variables } from 'shared/styles';
import { StyledHeadlineSmall } from 'shared/styles/styledComponents';

import { mfaFormSchema } from './MFAForm.schema';
import {
  StyledButton,
  StyledController,
  StyledForgotPasswordLink,
  StyledForm,
  StyledLoginSubheader,
} from '../Login.styles';

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

  // Check for session expiry
  useEffect(() => {
    if (mfaSession && Date.now() > mfaSession.expiresAt) {
      setErrorMessage(t('mfaSessionExpired'));
      setTimeout(() => {
        dispatch(auth.actions.clearMFASession());
        navigate('/login');
      }, 3000);
    }
  }, [mfaSession, dispatch, navigate, t]);

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
        setErrorMessage(t('mfaSessionExpired'));
        setTimeout(() => {
          dispatch(auth.actions.clearMFASession());
          navigate('/login');
        }, 2000);
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

  // Show warning after 3 attempts
  const showWarning = attempts >= 3 && attempts < maxAttempts;

  return (
    <Box sx={{ width: AUTH_BOX_WIDTH }}>
      <StyledForm ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadlineSmall color={variables.palette.on_surface}>
          {t('confirmYourIdentity')}
        </StyledHeadlineSmall>
        <StyledLoginSubheader color={variables.palette.on_surface_variant}>
          {t('enterVerificationCode')}
        </StyledLoginSubheader>

        <StyledController>
          <InputController
            fullWidth
            name="totpCode"
            control={control}
            label={t('verificationCode')}
            placeholder="000000"
            onChange={(e) => {
              if (errorMessage) {
                setErrorMessage('');
              }
            }}
            inputProps={{
              maxLength: 6,
              inputMode: 'numeric',
              pattern: '[0-9]*',
              autoComplete: 'one-time-code',
              style: { letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.25rem' },
            }}
            autoFocus
            error={!!errorMessage || showWarning}
            helperText={
              errorMessage ||
              (showWarning && t('attemptsRemaining', { count: maxAttempts - attempts }))
            }
            data-testid="mfa-form-code"
          />
        </StyledController>

        <StyledForgotPasswordLink
          onClick={handleRecoveryClick}
          data-testid="mfa-form-recovery-link"
        >
          {t('cantAccessAuthenticator')}
        </StyledForgotPasswordLink>

        <StyledButton
          variant="contained"
          type="submit"
          disabled={isSubmitting || authentication.status === 'loading'}
          data-testid="mfa-form-submit"
        >
          {t('continue')}
        </StyledButton>
      </StyledForm>
    </Box>
  );
};
