import { Checkbox, FormControlLabel } from '@mui/material';

import { MultiSelectItemAnswer } from '../RespondentDataReview.types';
import { StyledContainer } from './MultiSelectResponseItem.styles';

export const MultiSelectResponseItem = ({ activityItem, answer }: MultiSelectItemAnswer) => (
  <StyledContainer>
    {activityItem.responseValues.options.map(({ id, text, value }) => {
      const values = answer?.value.map((value) => +value) || [];
      const checked = values.includes(value!);

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
