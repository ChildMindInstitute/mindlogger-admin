import { Roles } from 'shared/consts';
import { Integration } from 'modules/Dashboard/api/api.types';

import { BaseSchema } from '../Base';

export type Workspace = {
  ownerId: string;
  workspaceName: string;
  image?: string;
  useArbitrary?: boolean;
  integrations?: Integration[] | null;
  areFeatureFlagsLoaded?: boolean;
};

export type AppletRoles = Record<string, Roles[]>;

export type WorkspaceWithRoles = Omit<Workspace, 'image'> & { workspaceRoles: AppletRoles };

export type WorkspacesSchema = {
  workspaces: BaseSchema<{ result: Workspace[]; count: number } | null>;
  currentWorkspace: BaseSchema<null | Workspace>;
  roles: BaseSchema<AppletRoles | null>;
  workspacesRoles: BaseSchema<WorkspaceWithRoles[] | null>;
};
