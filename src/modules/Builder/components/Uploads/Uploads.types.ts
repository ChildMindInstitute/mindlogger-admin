import { SxProps } from '@mui/material';

type Upload = {
  title: string;
  tooltipTitle: string;
  upload: JSX.Element;
};

export type UploadsProps = {
  uploads: Upload[];
  wrapperStyles?: SxProps;
  itemStyles?: SxProps;
};
