import { useRef } from 'react';

import { AppletPasswordRef } from 'shared/components';

export const useSetupEnterAppletPassword = () => {
  const appletPasswordRef = useRef<AppletPasswordRef | null>(null);
  const passwordRef = useRef<string | null>(null);

  const submitForm = () => {
    appletPasswordRef?.current?.submitForm();
  };

  return {
    appletPasswordRef,
    passwordRef,
    submitForm,
  };
};
