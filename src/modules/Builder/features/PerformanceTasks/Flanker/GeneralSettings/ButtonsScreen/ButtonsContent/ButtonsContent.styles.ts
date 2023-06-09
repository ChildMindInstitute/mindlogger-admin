import { styled } from '@mui/material';

import { StyledFlexSpaceBetween, theme } from 'shared/styles';

export const StyledRowWrapper = styled(StyledFlexSpaceBetween)`
  margin-bottom: ${theme.spacing(2)};
  flex: 0 0 calc(50% - 1.2rem);
  align-items: flex-start;
`;
