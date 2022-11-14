import { Dispatch, SetStateAction } from 'react';

export type AccountPanelProps = {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
};
