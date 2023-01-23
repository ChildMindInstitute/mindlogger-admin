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
  border-top: 1px solid #dee3eb;
  padding-top: 22px;
  padding-bottom: 22px;
`;

export const StyledChildren = styled(Box)`
  padding-left: 9px;
`;

export const StyledItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 400;
  margin-top: ${theme.spacing(2.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.6)};
`;
