import { styled } from '@mui/material';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

export const StyledEmptyState = styled(StyledFlexAllCenter)`
  flex-direction: column;
  height: 100%;
  gap: ${theme.spacing(1.6)};
  text-align: center;
  margin: 0 auto;
  padding: ${theme.spacing(6.4, 0)};
`;
