import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledTopBar = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100vw - 8.8rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing(1.8, 2.4, 1.8, 4)};
`;

export const StyledLeftBox = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledMoreBtn = styled(Button)`
  margin-left: ${theme.spacing(0.7)};
  padding: 0;
  height: auto;
  min-width: unset;
`;

export const StyledAvatarBtn = styled(Button)`
  padding: 0;
  border-radius: ${variables.borderRadius.half};
  height: 3rem;
  width: 3rem;
  min-width: unset;
`;

export const StyledImage = styled('img')`
  width: 2.4rem;
  height: 2.4rem;
`;
