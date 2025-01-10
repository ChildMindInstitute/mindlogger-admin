import {
  HydratedActivityFlow,
  SubjectDetailsWithRoles,
} from 'modules/Dashboard/types/Dashboard.types';
import { Activity, SingleApplet } from 'redux/modules';

export interface RespondentDataHeaderProps {
  applet: SingleApplet;
  subject: SubjectDetailsWithRoles;
  activityOrFlow?: Activity | HydratedActivityFlow;
  dataTestid: string;
}
