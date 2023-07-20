import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSubscaleContainer = styled(Box, shouldForwardProp)`
  margin-top: ${theme.spacing(2.4)};

  ${({ isNested }: { isNested: boolean }) => `
     ${
       isNested &&
       `
      border-radius: ${variables.borderRadius.lg2};
      border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
    `
     };
     `}

  .accordion-container {
    padding: ${theme.spacing(2.4, 3.2)};
    margin-bottom: 0;
  }
`;
