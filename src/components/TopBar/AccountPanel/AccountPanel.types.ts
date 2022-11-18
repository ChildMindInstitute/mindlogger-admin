import { Dispatch, SetStateAction } from 'react';

export type AccountPanelProps = {
  alertsQuantity: number;
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
};
