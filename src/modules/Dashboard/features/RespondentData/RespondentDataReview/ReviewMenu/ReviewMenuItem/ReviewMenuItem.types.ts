import { Dispatch, SetStateAction } from 'react';

import { Activity } from 'redux/modules';

import { ReviewType } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  item: Activity;
  isSelected: boolean;
  setSelectedItem: Dispatch<SetStateAction<Activity>>;
  setSelectedReview: Dispatch<SetStateAction<ReviewType | null>>;
};
