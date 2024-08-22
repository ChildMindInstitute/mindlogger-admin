import { Roles } from 'shared/consts';

import { BaseSchema } from '../Base';

export type Workspace = {
  ownerId: string;
  workspaceName: string;
  image?: string;
  useArbitrary?: boolean;
};

export type AppletRoles = Record<string, Roles[]>;

export type WorkspaceWithRoles = Omit<Workspace, 'image'> & { workspaceRoles: AppletRoles };

export type WorkspacesSchema = {
  workspaces: BaseSchema<{ result: Workspace[]; count: number } | null>;
  currentWorkspace: BaseSchema<null | Workspace>;
  roles: BaseSchema<AppletRoles | null>;
  workspacesRoles: BaseSchema<WorkspaceWithRoles[] | null>;
};
