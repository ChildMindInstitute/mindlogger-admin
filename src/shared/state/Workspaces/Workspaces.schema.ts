export type Workspace = {
  ownerId: string;
  workspaceName: string;
  image?: string;
};

export type WorkspacesSchema = {
  currentWorkspace: null | Workspace;
};
