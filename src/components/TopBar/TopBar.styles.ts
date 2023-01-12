import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { TOP_BAR_HEIGHT } from 'consts';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledQuantityCircle } from 'styles/styledComponents/QuantityCircle';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledTopBar = styled(Box)`
  height: ${TOP_BAR_HEIGHT};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing(1.4, 2.4, 1.4, 2)};
`;

export const StyledAvatarBtn = styled(StyledClearedButton)`
  border-radius: ${variables.borderRadius.half};
  height: 3rem;
  width: 3rem;
  position: relative;
`;

export const StyledImage = styled('img')`
  width: 3.2rem;
  height: 3.2rem;
`;

export const StyledQuantity = styled(StyledQuantityCircle)`
  top: -0.2rem;
  right: -0.2rem;
  min-width: 1.6rem;
  padding: ${theme.spacing(0.2)};
`;
