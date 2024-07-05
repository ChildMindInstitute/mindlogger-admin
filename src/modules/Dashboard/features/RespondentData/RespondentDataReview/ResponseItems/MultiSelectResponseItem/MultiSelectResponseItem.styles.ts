import { styled } from '@mui/material';

import {
  Disabled,
  SelectedDisabled,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/ActivityResponses/ActivityResponses.styles';
import { StyledFlexColumn } from 'shared/styles';

export const StyledContainer = styled(StyledFlexColumn)`
  .MuiFormControlLabel-root .MuiFormControlLabel-label.Mui-disabled,
  .MuiButtonBase-root.MuiCheckbox-root.Mui-disabled {
    ${Disabled}
  }

  .MuiButtonBase-root.MuiCheckbox-root.Mui-checked.Mui-disabled {
    ${SelectedDisabled}

    & + .MuiFormControlLabel-label.Mui-disabled {
      ${SelectedDisabled}
    }
  }
`;
