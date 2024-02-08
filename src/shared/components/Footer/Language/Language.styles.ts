import { styled, Box } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

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
