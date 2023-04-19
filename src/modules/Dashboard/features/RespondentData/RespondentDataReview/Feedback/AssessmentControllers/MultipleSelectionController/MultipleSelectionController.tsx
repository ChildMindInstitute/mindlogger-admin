import { Controller, useFormContext } from 'react-hook-form';

import { MultipleSelection } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessementItems';

import { MultipleSelectionProps } from './MultipleSelectionController.types';
import { getActivityItemIndex } from '../utils';

export const MultipleSelectionController = ({
  activityItem,
  isDisabled,
}: MultipleSelectionProps) => {
  const { control, getValues } = useFormContext();

  const activityItemIndex = getActivityItemIndex(
    getValues('answers'),
    activityItem.activityItem.id || '',
  );

  return (
    <Controller
      name={`answers.${activityItemIndex}.answer.value`}
      control={control}
      render={({ field: { ref, onChange, value, ...checkboxProps } }) => {
        const values = value?.filter((value: string) => value) || [];

        return (
          <MultipleSelection
            {...checkboxProps}
            onChange={onChange}
            isDisabled={isDisabled}
            activityItem={activityItem.activityItem}
            value={values}
          />
        );
      }}
    />
  );
};
