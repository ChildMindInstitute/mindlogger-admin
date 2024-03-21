import { Dispatch, SetStateAction } from 'react';
import { Control } from 'react-hook-form';

import { ReviewActivity } from 'api';
import { RespondentDetails } from 'modules/Dashboard/types/Dashboard.types';

import { RespondentsDataFormValues } from '../../RespondentData.types';
import { Answer } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  control: Control<RespondentsDataFormValues>;
  selectedDate: Date | null;
  responseDates?: Date[];
  onMonthChange: (date: Date) => void;
  activities: ReviewActivity[];
  selectedActivity: ReviewActivity | null;
  selectedAnswer: Answer | null;
  setSelectedActivity: Dispatch<SetStateAction<ReviewActivity | null>>;
  onDateChange: (date?: Date | null) => void;
  isDatePickerLoading: boolean;
  onSelectAnswer: (answer: Answer | null) => void;
  lastActivityCompleted?: RespondentDetails['lastSeen'];
};
