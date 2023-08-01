import { SxProps } from '@mui/material';

export enum WorkspaceUiType {
  List,
  Table,
}

export type WorkspaceImageProps = {
  uiType?: WorkspaceUiType;
  image?: string;
  workspaceName?: string;
  coverSxProps?: SxProps;
};
