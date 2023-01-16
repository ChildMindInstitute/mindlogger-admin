import { Dispatch, SetStateAction } from 'react';

export type AppletPasswordForm = { appletPassword: string };

export type AppletPasswordProps = {
  appletId: string;
  setDisabledSubmit: Dispatch<SetStateAction<boolean>>;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  submitCallback: () => void;
};
