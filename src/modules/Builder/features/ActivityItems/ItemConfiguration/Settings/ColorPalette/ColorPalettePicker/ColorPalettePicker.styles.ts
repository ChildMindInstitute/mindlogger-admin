import { Box, styled } from '@mui/material';

import { StyledFlexColumn } from 'shared/styles';

export const StyledColorPalettePickerContainer = styled(StyledFlexColumn)`
  .MuiFormGroup-root {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
  }
`;

export const StyledPaletteColorBox = styled(Box)`
  width: 100%;
  height: 3rem;
`;
