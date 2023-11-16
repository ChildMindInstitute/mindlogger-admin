import { Dispatch, SetStateAction } from 'react';

export type AccountPanelProps = {
  visibleDrawer: boolean;
  setVisibleDrawer: Dispatch<SetStateAction<boolean>>;
};
