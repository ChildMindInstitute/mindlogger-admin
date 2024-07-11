import { HydratedActivityFlow } from 'modules/Dashboard/types/Dashboard.types';
import { RespondentDetails } from 'modules/Dashboard/types';
import { Activity, SingleApplet } from 'redux/modules';

export interface RespondentDataHeaderProps {
  applet: SingleApplet;
  subject: RespondentDetails;
  activityOrFlow?: Activity | HydratedActivityFlow;
  dataTestid: string;
}
