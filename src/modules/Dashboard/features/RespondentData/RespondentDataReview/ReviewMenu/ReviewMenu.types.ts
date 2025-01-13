import { Control } from 'react-hook-form';

import { AnswerDate, ReviewEntity } from 'modules/Dashboard/api';
import { SubjectDetails } from 'modules/Dashboard/types/Dashboard.types';

import { RespondentsDataFormValues } from '../../RespondentData.types';
import { OnSelectActivityOrFlow, OnSelectAnswer } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  control: Control<RespondentsDataFormValues>;
  responseDates?: Date[];
  onMonthChange: (date: Date) => void;
  activities: ReviewEntity[];
  flows: ReviewEntity[] | null;
  selectedAnswer: AnswerDate | null;
  selectedActivityId?: string;
  selectedFlowId?: string;
  onDateChange: (date?: Date | null) => void;
  isDatePickerLoading: boolean;
  onSelectAnswer: OnSelectAnswer;
  lastActivityCompleted?: SubjectDetails['lastSeen'];
  isActivitiesFlowsLoading: boolean;
  onSelectActivity: OnSelectActivityOrFlow;
  onSelectFlow: OnSelectActivityOrFlow;
};
