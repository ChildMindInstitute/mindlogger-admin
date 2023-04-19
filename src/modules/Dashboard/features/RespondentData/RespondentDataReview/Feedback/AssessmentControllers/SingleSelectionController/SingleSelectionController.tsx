import { Controller, useFormContext } from 'react-hook-form';

import { SingleSelection } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessementItems';

import { SingleSelectionProps } from './SingleSelectionController.types';
import { getActivityItemIndex } from '../utils';

export const SingleSelectionController = ({ activityItem, isDisabled }: SingleSelectionProps) => {
  const { control, getValues } = useFormContext();

  const activityItemIndex = getActivityItemIndex(
    getValues('answers'),
    activityItem.activityItem.id || '',
  );

  return (
    <Controller
      name={`answers.${activityItemIndex}.answer.value`}
      control={control}
      render={({ field: { ref, onChange, ...radioGroupProps } }) => (
        <SingleSelection
          {...radioGroupProps}
          {...activityItem}
          isDisabled={isDisabled}
          onChange={(value) => onChange(value)}
        />
      )}
    />
  );
};
