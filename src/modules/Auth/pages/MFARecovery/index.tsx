import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { auth } from 'modules/Auth/state';
import { useAppSelector, useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { AUTH_BOX_WIDTH } from 'shared/consts';

import { RecoveryCodeForm } from '../../features/Login/MFAForm';

const MFARecovery = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mfaSession } = useAppSelector((state) => state.auth);

  // Route guard: redirect to login if no session
  useEffect(() => {
    if (!mfaSession) {
      navigate(page.login, { replace: true });
    }
  }, [mfaSession, navigate]);

  // Prevent flash of content when no session
  if (!mfaSession) {
    return null;
  }

  const handleSwitchToTOTP = () => {
    navigate(-1); // Use history back for clean navigation
  };

  const handleBackToLogin = () => {
    dispatch(auth.actions.clearMFASession());
    dispatch(auth.actions.clearMFAError());
    navigate(page.login, { replace: true });
  };

  return (
    <Box sx={{ width: AUTH_BOX_WIDTH }}>
      <RecoveryCodeForm onSwitchToTOTP={handleSwitchToTOTP} onBackToLogin={handleBackToLogin} />
    </Box>
  );
};

export default MFARecovery;
