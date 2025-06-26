import { Box, styled } from '@mui/material';

import { SelectController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledAlert = styled(Box)`
  width: 100%;
  padding: ${theme.spacing(2, 2.4, 2.4)};
  background-color: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};

  .MuiTypography-root {
    z-index: ${theme.zIndex.fab};
    pointer-events: none;
  }
`;

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledDescription = styled(StyledFlexTopCenter)`
  margin-bottom: ${theme.spacing(1.6)};
  flex-wrap: wrap;

  .MuiFormControl-root.MuiTextField-root {
    padding: ${theme.spacing(0, 0.5)};
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.outline};
    border-radius: ${variables.borderRadius.md};
  }

  .MuiInputBase-root.MuiOutlinedInput-root {
    padding: ${theme.spacing(0, 0.6)};
    height: 3.8rem;
  }

  .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input {
    min-width: 3rem;
    padding: ${theme.spacing(0.6, 2.8, 0.6, 0.6)};
  }

  .MuiFormControl-root.MuiTextField-root input {
    padding: ${theme.spacing(0.6, 0, 0.6, 0.6)};
    width: 3rem;
  }

  .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input,
  .MuiFormControl-root.MuiTextField-root input {
    font-size: ${variables.font.size.label1};
    line-height: ${variables.font.lineHeight.label1};
  }

  .MuiBox-root {
    width: auto;
  }

  & .MuiTypography-root {
    top: 0.6rem;
  }
`;

export const StyledSelectController = styled(SelectController)`
  min-width: 10rem;

  & .Mui-error {
    background: ${variables.palette.error_container};
  }
`;
