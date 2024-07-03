import { RespondentDetails } from 'modules/Dashboard/types';
import { Activity, SingleApplet } from 'redux/modules';

export interface RespondentDataHeaderProps {
  applet: SingleApplet;
  subject: RespondentDetails;
  activity?: Activity;
  dataTestid: string;
}
