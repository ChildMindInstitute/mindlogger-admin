import { HydratedActivityFlow } from 'modules/Dashboard/types/Dashboard.types';
import { SubjectDetails } from 'modules/Dashboard/types';
import { Activity, SingleApplet } from 'redux/modules';

export interface RespondentDataHeaderProps {
  applet: SingleApplet;
  subject: SubjectDetails;
  activityOrFlow?: Activity | HydratedActivityFlow;
  dataTestid: string;
}
