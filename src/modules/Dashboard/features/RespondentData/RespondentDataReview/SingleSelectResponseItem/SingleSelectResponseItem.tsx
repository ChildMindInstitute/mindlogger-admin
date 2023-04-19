import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

import { SingleSelectItemAnswer } from '../RespondentDataReview.types';

export const SingleSelectResponseItem = ({ activityItem, answer }: SingleSelectItemAnswer) => (
  <RadioGroup value={answer.value}>
    {activityItem.responseValues.options.map((option) => (
      <FormControlLabel
        key={option.id}
        value={option.id}
        disabled
        control={<Radio disabled />}
        label={option.text}
      />
    ))}
  </RadioGroup>
);
