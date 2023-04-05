import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

import { ResponseItemProps } from '../Review.types';

export const SingleSelectResponseItem = ({ item, response }: ResponseItemProps) => (
  <RadioGroup value={response.value}>
    {item.responseOptions?.map((option) => (
      <FormControlLabel
        value={option.value}
        disabled
        control={<Radio disabled />}
        label={option.label}
      />
    ))}
  </RadioGroup>
);
