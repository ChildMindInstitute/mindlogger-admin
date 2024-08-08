import { Control } from 'react-hook-form';

import { Activity } from 'redux/modules';
import { HydratedActivityFlow } from 'modules/Dashboard/types';

import { ActivityAssignFormValues } from '../ActivityAssignDrawer.types';

export type ActivitiesListProps = {
  activities: Activity[];
  flows: HydratedActivityFlow[];
  control: Control<ActivityAssignFormValues>;
  'data-testid': string;
};
