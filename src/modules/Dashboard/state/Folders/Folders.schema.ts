import { Folder } from 'redux/modules';
import { BaseSchema } from 'shared/state/Base';
import { Encryption } from 'shared/utils';

export type FolderApplet = {
  depth?: number;
  id: string;
  isExpanded?: boolean;
  isRenaming?: boolean;
  isFolder?: boolean;
  isNew?: boolean;
  isVisible?: boolean;
  items?: FolderApplet[];
  name?: string;
  description?: string;
  displayName?: string;
  editing?: boolean;
  encryption?: Encryption | null;
  hasUrl?: boolean;
  image?: string;
  largeApplet?: boolean;
  parentId?: string;
  pinOrder?: number;
  published?: boolean;
  role?: string;
  themeId?: string;
  updatedAt?: string;
  welcomeApplet?: boolean;
  isPublished?: boolean;
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

export type AppletSearchTerms = {
  categoryId: string | null;
  keywords: string[] | null;
  subCategoryId: string | null;
};

export type AppletsSearchTerms = {
  [id: string]: AppletSearchTerms;
};

export type FoldersSchema = {
  foldersApplets: BaseSchema<FolderApplet[]>;
  flattenFoldersApplets: BaseSchema<FolderApplet[]>;
  appletsSearchTerms: BaseSchema<AppletsSearchTerms | null>;
};
