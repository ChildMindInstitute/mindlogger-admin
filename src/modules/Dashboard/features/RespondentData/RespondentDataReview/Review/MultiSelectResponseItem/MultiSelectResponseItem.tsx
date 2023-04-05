import { Checkbox, FormControlLabel } from '@mui/material';

import { StyledFlexColumn } from 'shared/styles';

import { ResponseItemProps } from '../Review.types';

export const MultiSelectResponseItem = ({ item, response }: ResponseItemProps) => (
  <StyledFlexColumn>
    {item.responseOptions?.map((option) => (
      <FormControlLabel
        disabled
        label={option.label}
        control={<Checkbox checked={response[option.id] !== undefined} value={option.value} />}
      />
    ))}
  </StyledFlexColumn>
);
