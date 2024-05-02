import { Control } from 'react-hook-form';

import { ReviewActivity, ReviewFlow, AnswerDate } from 'modules/Dashboard/api';
import { RespondentDetails } from 'modules/Dashboard/types/Dashboard.types';

import { RespondentsDataFormValues } from '../../RespondentData.types';
import { OnSelectActivityOrFlow, OnSelectAnswer } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  control: Control<RespondentsDataFormValues>;
  responseDates?: Date[];
  onMonthChange: (date: Date) => void;
  activities: ReviewActivity[];
  flows: ReviewFlow[] | null;
  selectedAnswer: AnswerDate | null;
  selectedActivityId?: string;
  selectedFlowId?: string;
  onDateChange: (date?: Date | null) => void;
  isDatePickerLoading: boolean;
  onSelectAnswer: OnSelectAnswer;
  lastActivityCompleted?: RespondentDetails['lastSeen'];
  isActivitiesFlowsLoading: boolean;
  onSelectActivity: OnSelectActivityOrFlow;
  onSelectFlow: OnSelectActivityOrFlow;
};
