import { SxProps } from '@mui/material';

import { CropRatio } from 'shared/components/CropPopup';

export enum UploaderUiType {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export type UploaderProps = {
  width: number;
  height: number;
  setValue: (val: string) => void;
  getValue: () => string;
  uiType?: UploaderUiType;
  description?: string;
  wrapperStyles?: SxProps;
  cropRatio?: CropRatio;
  hasError?: boolean;
  disabled?: boolean;
  'data-testid'?: string;
};
