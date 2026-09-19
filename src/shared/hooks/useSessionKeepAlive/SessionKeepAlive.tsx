import { SessionTimeoutModal } from './SessionTimeoutModal';
import { useSessionExpiredLogout } from './useSessionExpiredLogout';
import { useSessionKeepAlive } from './useSessionKeepAlive';

// Must render inside <Router>: both hooks log out via useLogout, which relies on useNavigate.
export const SessionKeepAlive = () => {
  const { msRemaining, stayLoggedIn, logOutNow } = useSessionKeepAlive();
  useSessionExpiredLogout();

  if (msRemaining === null) return null;

  return (
    <SessionTimeoutModal
      msRemaining={msRemaining}
      onStayLoggedIn={stayLoggedIn}
      onLogOut={logOutNow}
    />
  );
};
