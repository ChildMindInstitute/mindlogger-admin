import Tooltip from '@mui/material/Tooltip';

import { ToolTipProps } from './ToolTip.types';

export const ToolTip = ({ toolTipTitle = '', children }: ToolTipProps) => (
  <Tooltip title={toolTipTitle}>{children}</Tooltip>
);
