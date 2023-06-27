import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

import { StyledFlexColumn, StyledFlexTopCenter } from './Flex';
import theme from '../theme';

export const StyledContainer = styled(StyledFlexTopCenter)`
  position: relative;
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;

export const StyledContainerWithBg = styled(StyledFlexColumn)`
  position: relative;
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  width: 100%;
`;
