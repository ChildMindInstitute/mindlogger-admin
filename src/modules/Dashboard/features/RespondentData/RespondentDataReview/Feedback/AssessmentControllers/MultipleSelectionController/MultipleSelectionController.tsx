import { Controller, FieldValues } from 'react-hook-form';

import { MultipleSelection } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessementItems';

import { MultipleSelectionProps } from './MultipleSelectionController.types';

export const MultipleSelectionController = <T extends FieldValues>({
  name,
  control,
  activityItem: { activityItem },
  isDisabled,
}: MultipleSelectionProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, onChange, value, ...checkboxProps } }) => {
      const values = value?.filter((value: string) => value) || [];

      return (
        <MultipleSelection
          {...checkboxProps}
          onChange={onChange}
          isDisabled={isDisabled}
          activityItem={activityItem}
          value={values}
        />
      );
    }}
  />
);
