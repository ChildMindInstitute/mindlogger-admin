import { Manager } from 'modules/Dashboard/types';
import { MenuActionProps } from 'shared/components';

export type ManagersActions = {
  removeAccessAction: ({ context }: MenuActionProps<Manager>) => void;
  editAccessAction: ({ context }: MenuActionProps<Manager>) => void;
};

export type ManagersData = {
  result: Manager[];
  count: number;
};
