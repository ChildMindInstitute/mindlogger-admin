import { Roles } from 'shared/consts';
import { BaseSchema } from '../Base';

export type Workspace = {
  ownerId: string;
  workspaceName: string;
  image?: string;
};

export type WorkspacesSchema = {
  currentWorkspace: null | Workspace;
  priorityRole: BaseSchema<Roles | null>;
};

export type WorkspacePriorityRoleApiParams = {
  params: {
    ownerId: string;
    appletIDs?: string[];
  };
};
