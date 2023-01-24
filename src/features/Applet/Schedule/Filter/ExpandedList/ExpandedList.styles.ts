import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledCollapseBtn = styled(Box)`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  &:hover {
    background-color: transparent;
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledCollapse = styled(Box)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(2.2, 0)};
`;

export const StyledChildren = styled(Box)`
  padding-left: ${theme.spacing(0.9)};
`;

export const StyledItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
  font-size: ${variables.font.size.md};
  line-height: 2rem;
  font-weight: ${variables.font.weight.regular};
  margin-top: ${theme.spacing(2.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.6)};
`;
