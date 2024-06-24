// import { Dispatch, SetStateAction } from 'react';

export type UploadDataPopupProps = {
  open: boolean;
  onClose: () => void;
  'data-testid'?: string;
};

export enum Steps {
  Agreement,
  Visits,
  Success,
  Error,
}

export type ScreenParams = {
  onSubmit: () => void;
  onClose: () => void;
};

// TODO: uncomment when the endpoints for visits are ready.
// export type ScreenParams = {
//   handleAcceptAgreement: () => void;
//   onClose: () => void;
//   handleSubmitVisits: () => void;
//   setIsLoading: Dispatch<SetStateAction<boolean>>;
//   setStep: Dispatch<SetStateAction<Steps>>;
// };
