import { Checkbox, FormControlLabel } from '@mui/material';

import { StyledFlexColumn } from 'shared/styles';

import { MultiSelectItemAnswer } from '../RespondentDataReview.types';

export const MultiSelectResponseItem = ({ activityItem, answer }: MultiSelectItemAnswer) => (
  <StyledFlexColumn>
    {activityItem.responseValues.options.map((option) => (
      <FormControlLabel
        disabled
        label={option.text}
        control={<Checkbox checked={answer.value.includes(option.id)} value={option.id} />}
      />
    ))}
  </StyledFlexColumn>
);
