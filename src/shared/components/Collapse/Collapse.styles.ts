import { Collapse, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledCollapseContainer = styled(Collapse)`
  background: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};
  padding: ${theme.spacing(2.4)};

  .MuiCollapse-wrapper {
    height: 100%;
  }
`;

export const StyledCollapseSwitchContainer = styled(Collapse)`
  .MuiCollapse-wrapper {
    height: 100%;
  }
`;

export const StyledCollapseHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  width: 100%;
  gap: 2.4rem;

  .MuiTypography-root {
    white-space: nowrap;
    flex-grow: ${({ isExpanded }: { isExpanded?: boolean }) => (isExpanded ? '1' : '0')};
  }
`;
