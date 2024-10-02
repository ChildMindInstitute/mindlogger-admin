import { BoxProps } from '@mui/material';

import { Activity } from 'redux/modules';

export type ActivityFlowThumbnailProps = BoxProps & {
  /** Activities or image URLs */
  activities?: Array<Activity | string | undefined>;
};
