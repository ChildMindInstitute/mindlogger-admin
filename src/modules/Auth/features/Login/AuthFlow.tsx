import { useEffect, useState } from 'react';

import { auth } from 'modules/Auth/state';
import { useAppSelector, useAppDispatch } from 'redux/store';

import { LoginForm } from './LoginForm';
import { MFAForm, RecoveryCodeForm } from './MFAForm';

type AuthFlowState = 'login' | 'mfa-totp' | 'mfa-recovery';

export const AuthFlow = () => {
  const dispatch = useAppDispatch();
  const { mfaSession } = useAppSelector((state) => state.auth);
  const [flowState, setFlowState] = useState<AuthFlowState>('login');
  const [hasHadMFASession, setHasHadMFASession] = useState(false);

  // Determine the flow state based on Redux state
  useEffect(() => {
    if (mfaSession) {
      setHasHadMFASession(true);
      setFlowState('mfa-totp');
    } else if (!hasHadMFASession) {
      // Only go back to login if we never had an MFA session
      setFlowState('login');
    }
    // If we had a session but it's gone (expired/error), stay on MFA form
  }, [mfaSession, hasHadMFASession]);

  // Don't automatically clear MFA session on unmount - let user retry

  const handleSwitchToRecovery = () => {
    setFlowState('mfa-recovery');
  };

  const handleSwitchToTOTP = () => {
    setFlowState('mfa-totp');
  };

  const handleBackToLogin = () => {
    // Clear MFA session and error state when user explicitly goes back
    dispatch(auth.actions.clearMFASession());
    dispatch(auth.actions.clearMFAError());
    setHasHadMFASession(false);
    setFlowState('login');
  };

  // Render the appropriate form based on flow state
  switch (flowState) {
    case 'mfa-totp':
      return (
        <MFAForm onSwitchToRecovery={handleSwitchToRecovery} onBackToLogin={handleBackToLogin} />
      );

    case 'mfa-recovery':
      return (
        <RecoveryCodeForm onSwitchToTOTP={handleSwitchToTOTP} onBackToLogin={handleBackToLogin} />
      );

    case 'login':
    default:
      return <LoginForm />;
  }
};
