import { Badge, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledBadge = styled(Badge, shouldForwardProp)`
  && .MuiBadge-badge {
    height: ${theme.spacing(1.8)};
    min-width: ${theme.spacing(1.8)};
    top: ${theme.spacing(0.2)};
    right: ${theme.spacing(0.2)};
    background-color: ${variables.palette.semantic.error};
    color: ${variables.palette.white};
    font-weight: ${variables.font.weight.bold};
    font-size: ${variables.font.size.xs};
    padding: ${theme.spacing(0, 0.6)};
    border-radius: ${theme.spacing(1)};

    ${({ outlineColor = variables.palette.white }: { outlineColor?: string }) =>
      `outline: ${variables.borderWidth.md} solid ${outlineColor};`}
  }
`;
