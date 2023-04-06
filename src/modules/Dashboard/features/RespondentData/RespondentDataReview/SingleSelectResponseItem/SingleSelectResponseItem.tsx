import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

import { SingleSelectResponseItemProps } from './SingleSelectResponseItem.types';

export const SingleSelectResponseItem = ({ item, response }: SingleSelectResponseItemProps) => (
  <RadioGroup value={response.value}>
    {item.responseValues.options.map((option) => (
      <FormControlLabel
        value={option.id}
        disabled
        control={<Radio disabled />}
        label={option.text}
      />
    ))}
  </RadioGroup>
);
