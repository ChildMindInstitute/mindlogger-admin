import { Dispatch, SetStateAction } from 'react';

import { Activity } from 'redux/modules';

export type ReportMenuProps = {
  activities: Activity[];
  selectedActivity: Activity;
  setSelectedActivity: Dispatch<SetStateAction<Activity>>;
};
