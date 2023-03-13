import { BaseSchema } from 'shared/state/Base';

export type Roles = 'manager' | 'user';

type CommonUserData = {
  fake: string | boolean;
  hasIndividualEvent: boolean;
  identifiers: string;
  nickName: string;
  pinned: boolean;
  refreshRequest: {
    requestDate: string;
    userPublicKey: string[];
  } | null;
  roles: string[];
  updated: string | null;
  viewable: boolean;
  _id: string;
};

export type ManagerData = CommonUserData & {
  email: string;
  firstName: string;
  lastName: string;
};

export type UserData = CommonUserData & {
  MRN: string;
};

export type Managers = {
  [id: string]: ManagerData;
};

export type Users = {
  [id: string]: UserData;
};

export type ManagersItems = {
  items: Managers[];
  total: number;
};

export type UsersItems = {
  items: Users[];
  total: number;
};

export type UsersSchema = {
  manager: BaseSchema<ManagersItems | null>;
  user: BaseSchema<UsersItems | null>;
};
