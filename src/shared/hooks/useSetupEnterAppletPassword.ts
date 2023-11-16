import { useRef } from 'react';

import { AppletPasswordRef } from 'shared/components';

export const useSetupEnterAppletPassword = () => {
  const appletPasswordRef = useRef<AppletPasswordRef | null>(null);

  const submitForm = () => {
    appletPasswordRef?.current?.submitForm();
  };

  return {
    appletPasswordRef,
    submitForm,
  };
};
