import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledBuilderItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  margin-bottom: ${theme.spacing(1.6)};
  padding: ${theme.spacing(1.3, 2.4)};
  width: 100%;
  border-radius: ${variables.borderRadius.lg2};

  &:hover {
    box-shadow: ${({ withHover }: { withHover?: boolean }) =>
      withHover ? variables.boxShadow.dark5 : 'inherit'};
  }
`;

export const StyledCol = styled(Box)`
  flex-grow: 1;
  padding-right: ${theme.spacing(1)};
`;

export const StyledActions = styled(Box)`
  width: auto;
  height: 2.4rem;
`;

export const StyledImg = styled('img')`
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.lg};
  max-width: 7.2rem;
  height: 7.2rem;
`;
