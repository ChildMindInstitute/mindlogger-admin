import { Control } from 'react-hook-form/dist/types';

export type CreateActivityPopupProps = {
  open: boolean;
  onClose: () => void;
};

export type FormValues = {
  activity: string;
  availability: string;
  oneTimeCompletion: boolean;
};

export type ControlType = Control<FormValues>;
