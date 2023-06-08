import { Alert } from '../ItemConfiguration.types';

export type AlertProps = {
  name: string;
  removeAlert: (i: number) => void;
  appendAlert: () => void;
};
