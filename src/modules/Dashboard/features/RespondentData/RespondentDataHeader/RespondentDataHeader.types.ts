import {
  HydratedActivityFlow,
  SubjectDetailsWithDataAccess,
} from 'modules/Dashboard/types/Dashboard.types';
import { Activity, SingleApplet } from 'redux/modules';

export interface RespondentDataHeaderProps {
  applet: SingleApplet;
  subject: SubjectDetailsWithDataAccess;
  activityOrFlow?: Activity | HydratedActivityFlow;
  dataTestid: string;
}
