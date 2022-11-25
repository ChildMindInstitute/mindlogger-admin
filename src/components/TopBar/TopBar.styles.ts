import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledQuantityCircle } from 'styles/styledComponents/QuantityCircle';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { TOP_BAR_HEIGHT } from 'utils/constants';

export const StyledTopBar = styled(Box)`
  height: ${TOP_BAR_HEIGHT};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing(1.8, 2.4)};
`;

export const StyledMoreBtn = styled(StyledClearedButton)`
  margin-left: ${theme.spacing(0.7)};
`;

export const StyledAvatarBtn = styled(StyledClearedButton)`
  border-radius: ${variables.borderRadius.half};
  height: 3rem;
  width: 3rem;
  position: relative;
`;

export const StyledImage = styled('img')`
  width: 2.4rem;
  height: 2.4rem;
`;

export const StyledQuantity = styled(StyledQuantityCircle)`
  top: -0.1rem;
  right: -0.1rem;
  width: 1.6rem;
  height: 1.6rem;
`;
