import { variables } from 'shared/styles/variables';

import { ToastProps } from './Toast.types';

export const Toast = ({ message, show }: ToastProps) => {
  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: variables.palette.neutral10,
        color: variables.palette.white,
        padding: '12px 24px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 400,
        zIndex: 9999,
        boxShadow: `0 3px 5px -1px ${variables.palette.black}33, 0 6px 10px 0 ${variables.palette.black}24, 0 1px 18px 0 ${variables.palette.black}1F`,
      }}
    >
      {message}
    </div>
  );
};
