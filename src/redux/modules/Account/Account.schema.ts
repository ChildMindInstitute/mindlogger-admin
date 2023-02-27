import { BaseSchema } from 'redux/modules/Base';
import { AuthToken } from 'redux/modules/Auth';

export type Alert = {
  alertMessage: string;
  appletId: string;
  created: string;
  id: string;
  itemId: string;
  itemSchema: string;
  profileId: string;
  viewed: boolean;
};

export type Profile = {
  _id: string;
  email: string;
  fake: string;
  firstName: string;
  hasIndividualEvent: false;
  identifiers: string;
  lastName: string;
  nickName: string;
  pinned: false;
  refreshRequest: {
    requestDate: string;
    userPublicKey: string[];
  } | null;
  roles: string[];
  updated: string;
  viewable: boolean;
};

type Applet = {
  description: string;
  displayName: string;
  editing: boolean;
  encryption: {
    appletPrime: number[];
    appletPublicKey: number[];
    base: number[];
  };
  hasUrl: boolean;
  id: string;
  image: string;
  largeApplet: boolean;
  name: string;
  published: boolean;
  roles: string[];
  themeId: string;
  updated: string;
  welcomeApplet: boolean;
};

export type Folder = {
  id: string;
  name: string;
};

export type Account = {
  accountId: string;
  accountName: string;
  isDefaultName: boolean;
  alerts: {
    list: Alert[];
    profiles: {
      [id: string]: Profile;
    };
  };
  applets: Applet[];
  folders: Folder[];
};

export type SwitchAccountData = {
  account: Account;
  authToken: AuthToken;
};

export type AccountSchema = {
  switchAccount: BaseSchema<SwitchAccountData | null>;
};
