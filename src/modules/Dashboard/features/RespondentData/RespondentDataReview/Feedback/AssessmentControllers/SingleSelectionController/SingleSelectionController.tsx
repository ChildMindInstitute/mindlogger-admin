import { Controller, FieldValues } from 'react-hook-form';

import { SingleSelection } from '../../AssessementItems';
import { SingleSelectionProps } from './SingleSelectionController.types';

export const SingleSelectionController = <T extends FieldValues>({
  name,
  control,
  activityItem: { activityItem },
  isDisabled,
}: SingleSelectionProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, onChange, ...radioGroupProps } }) => (
      <SingleSelection
        {...radioGroupProps}
        activityItem={activityItem}
        isDisabled={isDisabled}
        onChange={(value) => onChange(value)}
      />
    )}
  />
);
