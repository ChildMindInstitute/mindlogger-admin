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
  refreshRequest: string | null;
  roles: string[];
  updated: string;
  viewable: boolean;
};

export type Applet = {
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

export type FoldersApplets = {
  depth?: number;
  id?: string;
  isExpanded?: boolean;
  isRenaming?: boolean;
  isFolder?: boolean;
  isNew?: boolean;
  isVisible?: boolean;
  items?: FoldersApplets[];
  name?: string;
  description?: string;
  displayName?: string;
  editing?: boolean;
  encryption?: {
    appletPrime: number[];
    appletPublicKey: number[];
    base: number[];
  };
  hasUrl?: boolean;
  image?: string;
  largeApplet?: boolean;
  published?: boolean;
  roles?: string[];
  themeId?: string;
  updated?: string;
  welcomeApplet?: boolean;
};

export type AppletResponse = {
  accountId: string;
  activities: {
    [key: string]: string;
  };
  activityFlows: Record<string, string>;
  applet: {
    description: string;
    displayName: string;
    editing: boolean;
    encryption: {
      appletPrime: number[];
      appletPublicKey: number[];
      base: number[];
    };
    image: string;
    largeApplet: boolean;
    themeId: string;
    url: string;
    version: string;
    _id: string;
  };
  encryption?: {
    appletPrime: number[];
    appletPublicKey: number[];
    base: number[];
  };
  hasUrl: boolean;
  id?: string;
  name?: string;
  published: boolean;
  roles: string[];
  updated: string;
};

export type LoadedFolderApplet = AppletResponse &
  Partial<{
    isFolder: boolean;
    isChild: boolean;
    isExpanded: boolean;
  }>;

export type LoadedFolder = Folder &
  Partial<AppletResponse> & {
    isFolder: boolean;
    isExpanded?: boolean;
    items: LoadedFolderApplet[];
  };

export type AccountSchema = {
  switchAccount: BaseSchema<SwitchAccountData | null>;
  accountFoldersApplets: BaseSchema<FoldersApplets[] | null>;
};
