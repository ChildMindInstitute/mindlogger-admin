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

  // Determine the flow state based on Redux state
  useEffect(() => {
    if (mfaSession) {
      setFlowState('mfa-totp');
    } else {
      setFlowState('login');
    }
  }, [mfaSession]);

  // Clean up MFA session on unmount
  useEffect(
    () => () => {
      // Only clear if we're still in MFA flow (not after successful login)
      if (mfaSession) {
        dispatch(auth.actions.clearMFASession());
      }
    },
    [dispatch, mfaSession],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSwitchToRecovery = () => {
    setFlowState('mfa-recovery');
  };

  const handleSwitchToTOTP = () => {
    setFlowState('mfa-totp');
  };

  // Render the appropriate form based on flow state
  switch (flowState) {
    case 'mfa-totp':
      return <MFAForm onSwitchToRecovery={handleSwitchToRecovery} />;

    case 'mfa-recovery':
      return <RecoveryCodeForm onSwitchToTOTP={handleSwitchToTOTP} />;

    case 'login':
    default:
      return <LoginForm />;
  }
};
