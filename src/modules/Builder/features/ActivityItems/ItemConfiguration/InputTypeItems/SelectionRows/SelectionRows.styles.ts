import { Button, Collapse, styled } from '@mui/material';

import { StyledFlexTopCenter, StyledFlexColumn, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSelectionRowsContainer = styled(Collapse)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(2.4)};
  border-radius: ${variables.borderRadius.lg2};

  .MuiCollapse-wrapper {
    height: 100%;
  }
`;

export const StyledSelectionRow = styled(StyledFlexTopCenter, shouldForwardProp)`
  height: ${({ hasTooltips }: { hasTooltips?: boolean }) => (hasTooltips ? '20.4rem' : '12.4rem')};

  align-items: stretch;
`;

export const StyledSelectionBox = styled(StyledFlexColumn)`
  flex: 1 1;
  justify-content: space-between;
  padding: ${theme.spacing(2.4, 1.2)};
  gap: 4.4rem;

  :not(:last-child) {
    border-right: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  }

  && .MuiSvgIcon-root {
    color: ${variables.palette.on_surface_variant};
  }
`;

export const StyledAddRowButton = styled(Button)`
  width: 13.2rem;
  align-self: flex-start;
  border: none !important;
`;
