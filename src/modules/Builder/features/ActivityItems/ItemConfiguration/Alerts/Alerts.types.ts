import { Alert } from '../ItemConfiguration.types';

export type AlertProps = {
  removeAlert: (i: number) => void;
  appendAlert: () => void;
  alerts: (Alert & { id?: string })[];
};
