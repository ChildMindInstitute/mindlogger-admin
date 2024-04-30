import { FormControlLabel, Radio } from '@mui/material';

import { SingleSelectItemAnswer } from '../../RespondentDataReview.types';
import { StyledRadioGroup } from './SingleSelectResponseItem.styles';

export const SingleSelectResponseItem = ({
  activityItem,
  answer,
  'data-testid': dataTestid,
}: SingleSelectItemAnswer) => (
  <StyledRadioGroup value={answer?.value || ''} data-testid={dataTestid}>
    {activityItem.responseValues.options.map((option, index) => (
      <FormControlLabel
        key={option.id}
        disabled
        control={<Radio value={option.value} disabled checked={option.value === answer?.value} />}
        label={option.text}
        data-testid={`${dataTestid}-option-${index}`}
      />
    ))}
  </StyledRadioGroup>
);
