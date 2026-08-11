import { useSessionExpiredLogout } from './useSessionExpiredLogout';
import { useSessionKeepAlive } from './useSessionKeepAlive';

// Must render inside <Router>: both hooks log out via useLogout, which relies on useNavigate.
export const SessionKeepAlive = () => {
  useSessionKeepAlive();
  useSessionExpiredLogout();

  return null;
};
