import { BoxProps } from '@mui/material';

import { RespondentDetails } from 'modules/Dashboard/types';
import { Activity, ActivityFlow, SingleApplet } from 'redux/modules';

export interface FlowGridProps extends BoxProps {
  applet?: SingleApplet | undefined;
  flows?: ActivityFlow[];
  activities?: Activity[];
  subject?: RespondentDetails;
}
