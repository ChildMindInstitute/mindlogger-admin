import { Checkbox, FormControlLabel } from '@mui/material';

import { MultiSelectItemAnswer } from '../RespondentDataReview.types';
import { StyledContainer } from './MultiSelectResponseItem.styles';

export const MultiSelectResponseItem = ({ activityItem, answer }: MultiSelectItemAnswer) => (
  <StyledContainer>
    {activityItem.responseValues.options.map((option) => (
      <FormControlLabel
        key={option.id}
        disabled
        label={option.text}
        control={<Checkbox checked={!!answer?.value.includes(option.id)} value={option.id} />}
      />
    ))}
  </StyledContainer>
);
