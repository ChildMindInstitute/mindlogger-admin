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
        backgroundColor: '#323232',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 400,
        zIndex: 9999,
        boxShadow:
          '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
      }}
    >
      {message}
    </div>
  );
};
