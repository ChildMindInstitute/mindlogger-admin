import { Collapse, styled } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledSliderPanelContainer = styled(Collapse)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(2.4)};
  border-radius: ${variables.borderRadius.lg2};

  .MuiCollapse-wrapper {
    height: 100%;
  }
`;

export const StyledInputContainer = styled(StyledFlexTopCenter)`
  gap: 2.4rem;
`;

export const StyledScoresContainer = styled(StyledFlexTopCenter)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.lg2};
  margin-top: ${theme.spacing(2.4)};

  .MuiTableContainer-root {
    border: none;
    border-radius: 0;

    table {
      table-layout: fixed;
    }

    &:first-of-type {
      width: 13rem;
    }

    &:last-of-type {
      flex-grow: 1;
    }

    .MuiTableCell-head {
      background: transparent;
    }

    .MuiTableCell-head,
    .MuiTableCell-body {
      font-size: ${variables.font.size.md};
      line-height: ${variables.font.lineHeight.md};
      font-weight: ${variables.font.weight.regular};
      color: ${variables.palette.on_surface};
      letter-spacing: ${variables.font.letterSpacing.lg};
    }
  }
`;
