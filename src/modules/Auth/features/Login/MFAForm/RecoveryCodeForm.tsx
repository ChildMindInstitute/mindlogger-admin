import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
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

import { recoveryCodeSchema } from './MFAForm.schema';
import {
  StyledButton,
  StyledController,
  StyledForgotPasswordLink,
  StyledForm,
  StyledLoginSubheader,
} from '../Login.styles';
import { useMFASessionExpiry } from './useMFASessionExpiry';

interface RecoveryCodeFormData {
  code: string;
}

interface RecoveryCodeFormProps {
  onSwitchToTOTP?: () => void;
}

export const RecoveryCodeForm = ({ onSwitchToTOTP }: RecoveryCodeFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionRedirectTimeoutRef = useRef<number>();
  const hasSessionExpiredRef = useRef(false);

  const { mfaSession, authentication } = useAppSelector((state) => state.auth);

  const { handleSubmit, control, setValue, watch } = useForm<RecoveryCodeFormData>({
    resolver: yupResolver(recoveryCodeSchema()),
    defaultValues: {
      code: '',
    },
  });

  const code = watch('code');

  // Clear error when user starts typing
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onSubmit = async (data: RecoveryCodeFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { verifyMFARecoveryCode } = auth.thunk;
    const result = await dispatch(verifyMFARecoveryCode({ code: data.code }));

    if (verifyMFARecoveryCode.fulfilled.match(result)) {
      navigateToLibrary(navigate);
    }

    if (verifyMFARecoveryCode.rejected.match(result)) {
      const errorPayload = result.payload as { message?: string };
      const errorMsg =
        typeof errorPayload?.message === 'string'
          ? errorPayload.message
          : errorPayload || t('invalidRecoveryCode');
      const errorMsgStr = typeof errorMsg === 'string' ? errorMsg : t('invalidRecoveryCode');

      // Handle specific error cases
      if (errorMsgStr.includes('Invalid recovery code')) {
        setErrorMessage(t('invalidRecoveryCode'));
        setValue('code', '');
      } else if (errorMsgStr.includes('expired')) {
        handleSessionExpired();
      } else {
        setErrorMessage(errorMsgStr);
      }
    }

    setIsSubmitting(false);
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

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formatted = formatRecoveryCode(e.target.value);
    setValue('code', formatted);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <Box sx={{ width: AUTH_BOX_WIDTH }}>
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadlineSmall color={variables.palette.on_surface}>
          {t('useRecoveryCode')}
        </StyledHeadlineSmall>
        <StyledLoginSubheader color={variables.palette.on_surface_variant}>
          {t('enterOneRecoveryCode')}
        </StyledLoginSubheader>

        <StyledController>
          <InputController
            fullWidth
            name="code"
            control={control}
            label={t('recoveryCode')}
            placeholder="XXXXX-XXXXX"
            onChange={handleCodeChange}
            inputProps={{
              maxLength: 11,
              autoComplete: 'off',
              style: { letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.1rem' },
            }}
            autoFocus
            error={!!errorMessage}
            helperText={errorMessage}
            data-testid="recovery-form-code"
          />
        </StyledController>

        <StyledForgotPasswordLink onClick={handleBackToTOTP} data-testid="recovery-form-back-link">
          {t('backToAuthenticator')}
        </StyledForgotPasswordLink>

        <StyledButton
          variant="contained"
          type="submit"
          disabled={isSubmitting || authentication.status === 'loading'}
          data-testid="recovery-form-submit"
        >
          {t('continue')}
        </StyledButton>
      </StyledForm>
    </Box>
  );
};
