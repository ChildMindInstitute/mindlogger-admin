import { styled } from '@mui/material';

import { StyledFlexTopCenter, variables, theme } from 'shared/styles';
import { SelectController } from 'shared/components/FormComponents';

export const StyledSummaryRow = styled(StyledFlexTopCenter)`
  gap: 0.4rem;
  padding: ${theme.spacing(0.8, 1.2)};

  & > .MuiTypography-root,
  & > .MuiBox-root {
    flex: 0;

    &.MuiTypography-root {
      white-space: nowrap;
    }
  }

  .MuiTypography-root {
    top: 0.6rem;
    z-index: ${theme.zIndex.fab};
  }
`;

export const StyledSelectController = styled(SelectController)`
  min-width: 10rem;

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};

    &.Mui-error {
      background: ${variables.palette.error_container};
    }
  }

  .MuiSelect-select {
    padding: ${theme.spacing(0.65, 1.2)};
  }

  .MuiFormHelperText-root {
    display: none;
  }
`;
