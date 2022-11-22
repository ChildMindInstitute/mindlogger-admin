import { BaseSchema } from 'redux/modules/Base';

export type UserData = {
  _id: string;
  email: string;
  fake: string;
  firstName: string;
  hasIndividualEvent: boolean;
  identifiers: string;
  lastName: string;
  nickName: string;
  pinned: boolean;
  refreshRequest: string | null;
  roles: string[];
  updated: string | null;
  viewable: boolean;
};

export type Users = {
  [id: string]: UserData;
};

export type UsersItems = {
  items: Users[];
  total: number;
};

export type UsersSchema = {
  manager: BaseSchema<UsersItems | null>;
  reviewer: BaseSchema<UsersItems | null>;
  editor: BaseSchema<UsersItems | null>;
  user: BaseSchema<UsersItems | null>;
  coordinator: BaseSchema<UsersItems | null>;
};
