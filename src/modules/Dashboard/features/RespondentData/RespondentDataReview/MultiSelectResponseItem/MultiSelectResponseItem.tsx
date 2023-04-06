import { Checkbox, FormControlLabel } from '@mui/material';

import { StyledFlexColumn } from 'shared/styles';

import { MultiSelectResponseItemProps } from './MultiSelectResponseItem.types';

export const MultiSelectResponseItem = ({ item, response }: MultiSelectResponseItemProps) => (
  <StyledFlexColumn>
    {item.responseValues.options.map((option) => (
      <FormControlLabel
        disabled
        label={option.text}
        control={<Checkbox checked={response[option.id] !== undefined} value={option.id} />}
      />
    ))}
  </StyledFlexColumn>
);
