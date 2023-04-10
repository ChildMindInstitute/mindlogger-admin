import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  margin-bottom: ${theme.spacing(1.6)};
  padding: ${theme.spacing(1.3, 2.4)};
  width: 100%;
  border-radius: ${variables.borderRadius.lg2};
  height: 9.8rem;

  ${({ withHover, hasError }: { withHover?: boolean; hasError?: boolean }) => `
    background: ${hasError ? variables.palette.error_container : 'inherit'};

    &:hover {
      box-shadow: ${withHover ? variables.boxShadow.dark5 : 'inherit'};
    }
  `}
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
