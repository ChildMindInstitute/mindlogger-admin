import { styled } from '@mui/material';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledConditionContainer = styled(StyledFlexTopCenter)`
  gap: 0.4rem;
  padding: ${theme.spacing(0.8, 1.2)};
  border-radius: ${variables.borderRadius.xs};
  position: relative;

  & > * {
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
  }
`;

export const StyledSelectController = styled(SelectController)`
  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};
  }

  .MuiSelect-select {
    padding: ${theme.spacing(0.65, 1.2)};
  }
`;

export const StyledInputController = styled(InputController)`
  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};
    padding-right: ${theme.spacing(0.7)};
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(0.6, 1.2)};
  }

  .MuiBox-root {
    margin-left: 0;
  }
`;
