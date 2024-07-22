import { styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledIntegrationContainer = styled(StyledFlexColumn, shouldForwardProp)`
  ${({ isAnyIntegrationEnabled }: { isAnyIntegrationEnabled: boolean }) =>
    isAnyIntegrationEnabled &&
    `border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    border-radius: ${variables.borderRadius.lg2};
    padding: ${theme.spacing(2.4)};
    margin: ${theme.spacing(1.2, 0)};
  `};
`;
