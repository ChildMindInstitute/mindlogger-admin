import { styled } from '@mui/material';

import { StyledFlexTopCenter } from './Flex';

import theme from '../theme';

export const StyledContainer = styled(StyledFlexTopCenter)`
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;
