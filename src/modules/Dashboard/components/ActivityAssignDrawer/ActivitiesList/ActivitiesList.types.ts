import { Activity } from 'redux/modules';
import { HydratedActivityFlow } from 'modules/Dashboard/types';

export type ActivitiesListProps = {
  activities: Activity[];
  flows: HydratedActivityFlow[];
  activityIds?: string[];
  flowIds?: string[];
  onChangeActivityIds?: (activityIds: string[]) => void;
  onChangeFlowIds?: (flowIds: string[]) => void;
  isReadOnly?: boolean;
  'data-testid': string;
};
