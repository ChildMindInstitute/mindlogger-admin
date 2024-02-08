import { styled } from '@mui/material';

import { SelectController, InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, variables, theme } from 'shared/styles';

export const StyledCondition = styled(StyledFlexTopCenter)`
  gap: 0.4rem;
  padding: ${theme.spacing(0.8, 1.2)};
  border-radius: ${variables.borderRadius.xs};
  position: relative;
  flex-wrap: wrap;

  & > .MuiTypography-root,
  & > .MuiBox-root {
    flex: 0;
  }

  & > .MuiButtonBase-root {
    position: absolute;
    right: 0;
    display: none;
  }

  :hover {
    background: ${variables.palette.on_surface_alfa8};

    & > .MuiButtonBase-root {
      display: flex;
    }
  }

  .MuiTypography-root {
    top: 0.6rem;
    z-index: ${theme.zIndex.fab};
    pointer-events: none;
  }
`;

export const StyledSelectController = styled(SelectController)`
  min-width: 10rem;
  width: 100%;

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};

    &.Mui-error {
      background: ${variables.palette.error_container};
    }

    &.Mui-disabled .MuiOutlinedInput-notchedOutline {
      border-color: ${variables.palette.outline};
    }
  }

  .MuiSelect-select {
    padding: ${theme.spacing(0.65, 1.2)};
  }

  .MuiFormHelperText-root {
    display: none;
  }

  .MuiSvgIcon-root.Mui-disabled {
    display: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.outline};
  }
`;

export const StyledInputController = styled(InputController)`
  width: 8rem;

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};
    padding-right: ${theme.spacing(0.7)};

    &.Mui-error {
      background: ${variables.palette.error_container};
    }
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(0.6, 1.2)};
  }

  .MuiBox-root {
    margin-left: 0;
  }

  .MuiFormHelperText-root {
    display: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.outline};
  }
`;
