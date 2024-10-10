import { Dispatch, SetStateAction } from 'react';

export type DisconnectionPopupProps = {
  open: boolean;
  onClose: () => void;
};

export enum DisconnectionSteps {
  CurrentConnectionInfo,
  Confirmation,
}

export type GetScreensProps = {
  onClose: () => void;
  setStep: Dispatch<SetStateAction<DisconnectionSteps>>;
};
