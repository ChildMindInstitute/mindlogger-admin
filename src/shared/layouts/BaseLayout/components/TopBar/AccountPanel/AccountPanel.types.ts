import { Dispatch, SetStateAction } from 'react';

export type AccountPanelProps = {
  alertsQuantity: number;
  visibleDrawer: boolean;
  setVisibleDrawer: Dispatch<SetStateAction<boolean>>;
};
