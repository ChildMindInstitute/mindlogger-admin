import { useSessionKeepAlive } from './useSessionKeepAlive';

// Must render inside <Router>: the hook logs out via useLogout, which relies on useNavigate.
export const SessionKeepAlive = () => {
  useSessionKeepAlive();

  return null;
};
