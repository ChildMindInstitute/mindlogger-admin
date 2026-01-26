import { StyledToast } from './Toast.styles';
import { ToastProps } from './Toast.types';

export const Toast = ({ message, show }: ToastProps) => {
  if (!show) {
    return null;
  }

  return <StyledToast>{message}</StyledToast>;
};
