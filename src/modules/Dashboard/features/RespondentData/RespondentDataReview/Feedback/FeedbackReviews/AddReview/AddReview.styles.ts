import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledAddReviewWrapper = styled(Box)`
  background-color: ${variables.palette.surface3};
  border-radius: ${variables.borderRadius.lg2};
  padding: ${theme.spacing(2.4)};
`;

export const StyledAddButtonWrapper = styled(StyledFlexTopCenter)`
  padding-top: ${theme.spacing(2.5)};
  justify-content: flex-end;
`;
