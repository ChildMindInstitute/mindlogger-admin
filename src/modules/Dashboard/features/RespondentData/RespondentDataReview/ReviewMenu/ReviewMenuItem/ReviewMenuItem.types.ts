import { Dispatch, SetStateAction } from 'react';

import { Activity } from 'redux/modules';

import { Response } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  item: Activity;
  isSelected: boolean;
  responses: Response[];
  selectedResponse: Response | null;
  setSelectedItem: Dispatch<SetStateAction<Activity>>;
  setSelectedResponse: Dispatch<SetStateAction<Response | null>>;
};
