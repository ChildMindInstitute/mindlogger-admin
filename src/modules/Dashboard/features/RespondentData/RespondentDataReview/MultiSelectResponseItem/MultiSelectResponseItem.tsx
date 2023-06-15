import { Checkbox, FormControlLabel } from '@mui/material';

import { MultiSelectItemAnswer } from '../RespondentDataReview.types';
import { StyledContainer } from './MultiSelectResponseItem.styles';

export const MultiSelectResponseItem = ({ activityItem, answer }: MultiSelectItemAnswer) => (
  <StyledContainer>
    {activityItem.responseValues.options.map(({ id, text, value }) => {
      const checked = answer?.value.includes(value!);

      return (
        <FormControlLabel
          key={id}
          disabled
          label={text}
          control={<Checkbox checked={checked} value={value} />}
        />
      );
    })}
  </StyledContainer>
);
