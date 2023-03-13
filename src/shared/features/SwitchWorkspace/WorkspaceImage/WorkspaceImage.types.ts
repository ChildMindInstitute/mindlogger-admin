export enum WorkspaceUiType {
  List = 0,
  Table = 1,
}

export type WorkspaceImageProps = {
  uiType?: WorkspaceUiType;
  image?: string;
  workspaceName?: string;
};
