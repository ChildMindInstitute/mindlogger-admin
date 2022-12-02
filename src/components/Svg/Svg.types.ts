import { MouseEventHandler } from 'react';

export type SvgProps = {
  id: string;
  width?: number | string;
  height?: number | string;
  onMouseEnter?: MouseEventHandler;
};
