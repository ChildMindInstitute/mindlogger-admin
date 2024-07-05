import { RadioGroup, styled } from '@mui/material';

import {
  Disabled,
  SelectedDisabled,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/ActivityResponses/ActivityResponses.styles';

export const StyledRadioGroup = styled(RadioGroup)`
  .MuiFormControlLabel-root .MuiFormControlLabel-label.Mui-disabled,
  .MuiButtonBase-root.MuiRadio-root.Mui-disabled {
    ${Disabled}
  }

  .MuiButtonBase-root.MuiRadio-root.Mui-checked.Mui-disabled {
    ${SelectedDisabled}

    & + .MuiFormControlLabel-label.Mui-disabled {
      ${SelectedDisabled}
    }
  }
`;
