import { Dispatch, SetStateAction } from 'react';

import { Control } from 'react-hook-form';

import { ReviewActivity } from 'api';

import { Answer } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  control: Control<{ date: Date | null }>;
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
};
