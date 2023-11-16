import { styled } from '@mui/material';

import { variables, theme, StyledFlexTopCenter, StyledEllipsisText } from 'shared/styles';

export const StyledName = styled(StyledEllipsisText)`
  color: ${variables.palette.primary};
  font-weight: ${variables.font.weight.bold};
  max-width: 17rem;
`;

export const StyledNameWrapper = styled(StyledFlexTopCenter)`
  font-size: ${variables.font.size.md};
  color: ${variables.palette.on_surface_variant};
  margin-left: ${theme.spacing(3)};

  svg {
    fill: ${variables.palette.primary};
    margin-right: ${theme.spacing(1)};
  }
`;
