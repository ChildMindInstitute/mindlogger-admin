import { Box, styled } from '@mui/material';

import { theme, StyledFlexTopCenter, StyledBodyMedium, StyledFlexTopStart } from 'shared/styles';
import { variables } from 'shared/styles';

export const StyledWrapper = styled(Box)`
  margin: ${theme.spacing(2.4, 0)};

  .MuiToggleButtonGroup-root .MuiToggleButton-root {
    width: 100%;
  }
`;

export const StyledButtonsTitle = styled(StyledBodyMedium)`
  margin-bottom: ${theme.spacing(1.2)};
`;

export const StyledTimeWrapper = styled(Box)`
  flex: 1;
`;

export const StyledTimeRow = styled(StyledFlexTopStart)`
  justify-content: space-between;
`;

export const StyledDatePickerWrapper = styled(StyledFlexTopCenter)`
  width: 100%;

  input.MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled {
    -webkit-text-fill-color: ${variables.palette.on_surface};
  }
`;
