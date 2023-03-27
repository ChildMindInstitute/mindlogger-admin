import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledActivity = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(1.2, 2.4)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(1.6)};
  cursor: pointer;

  ${({ isSelected }: { isSelected: boolean }) =>
    isSelected &&
    `
    background-color: ${variables.palette.surface2};
    p {
      font-weight: ${variables.font.weight.bold};
    }
  `}
`;
