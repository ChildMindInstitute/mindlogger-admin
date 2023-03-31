export type Workspace = {
  ownerId: string;
  workspaceName: string;
  owned: boolean;
  image?: string;
};

export type WorkspacesSchema = {
  currentWorkspace: null | Workspace;
};
