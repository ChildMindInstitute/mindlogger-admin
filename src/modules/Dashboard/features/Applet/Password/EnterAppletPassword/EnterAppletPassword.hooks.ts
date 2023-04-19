import { useRef } from 'react';

import { AppletPasswordRef } from '../Password.types';

export const useSetupEnterAppletPassword = () => {
  const appletPasswordRef = useRef<AppletPasswordRef | null>(null);

  const submitForm = () => {
    if (!appletPasswordRef?.current) return;

    appletPasswordRef.current.submitForm();
  };

  return {
    appletPasswordRef,
    submitForm,
  };
};
