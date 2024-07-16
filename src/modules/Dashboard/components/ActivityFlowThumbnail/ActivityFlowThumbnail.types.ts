import { BoxProps } from '@mui/material';

import { Activity } from 'redux/modules';

export type ActivityFlowThumbnailProps = BoxProps & {
  activities?: Activity[];
};
