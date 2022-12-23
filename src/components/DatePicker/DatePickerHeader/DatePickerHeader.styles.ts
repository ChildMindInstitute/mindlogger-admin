import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledBox = styled(StyledFlexTopCenter)`
  width: 50%;
  margin: ${theme.spacing(0, 1)};
  justify-content: space-between;
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:hover {
    svg {
      fill: ${variables.palette.primary};
    }
  }
`;
