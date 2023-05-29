import { Roles } from 'shared/consts';

import { BaseSchema } from '../Base';

export type Workspace = {
  ownerId: string;
  workspaceName: string;
  image?: string;
};

export type WorkspacesSchema = {
  currentWorkspace: null | Workspace;
  roles: BaseSchema<{
    [key: string]: Roles[];
  } | null>;
};
