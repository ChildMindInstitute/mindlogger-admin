import { BoxProps } from '@mui/material';

import { RespondentDetails } from 'modules/Dashboard/types';
import { Activity, ActivityFlow } from 'redux/modules';

export interface FlowGridProps extends BoxProps {
  appletId?: string;
  flows?: ActivityFlow[];
  activities?: Activity[];
  subject?: RespondentDetails;
}
