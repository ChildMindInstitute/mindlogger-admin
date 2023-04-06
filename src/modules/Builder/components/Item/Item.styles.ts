import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  margin-bottom: ${theme.spacing(1.6)};
  padding: ${theme.spacing(1.3, 2.4)};
  width: 100%;
  border-radius: ${variables.borderRadius.lg2};
  height: 9.8rem;

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
