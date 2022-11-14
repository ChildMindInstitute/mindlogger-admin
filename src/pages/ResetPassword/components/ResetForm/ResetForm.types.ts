import { Dispatch, SetStateAction } from 'react';

export type ResetFormProps = {
  setEmail?: Dispatch<SetStateAction<string>>;
  onSubmitForTest?: () => void;
};
