import { FormControlLabel, Radio } from '@mui/material';

import { SingleSelectItemAnswer } from '../RespondentDataReview.types';
import { StyledRadioGroup } from './SingleSelectResponseItem.styles';

export const SingleSelectResponseItem = ({ activityItem, answer }: SingleSelectItemAnswer) => (
  <StyledRadioGroup value={answer.value}>
    {activityItem.responseValues.options.map((option) => (
      <FormControlLabel
        key={option.id}
        value={option.id}
        disabled
        control={<Radio disabled />}
        label={option.text}
      />
    ))}
  </StyledRadioGroup>
);
