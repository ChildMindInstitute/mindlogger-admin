import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledLanguage = styled(StyledFlexTopCenter)`
  margin: ${theme.spacing(0, 2.4)};
  cursor: pointer;
`;

export const StyledFlag = styled(Box)`
  width: 2.4rem;
  height: 2.4rem;
  overflow: hidden;
  border-radius: 50%;
  margin-right: ${theme.spacing(0.4)};

  svg {
    transform: translate(-0.4rem);
  }
`;
