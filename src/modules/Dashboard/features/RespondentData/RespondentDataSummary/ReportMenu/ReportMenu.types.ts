import { Dispatch, SetStateAction } from 'react';

import { DatavizActivity } from 'api';

export type ReportMenuProps = {
  activities: DatavizActivity[];
  selectedActivity?: DatavizActivity;
  setSelectedActivity: Dispatch<SetStateAction<DatavizActivity | undefined>>;
};
