import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

export const StyledContainer = styled(StyledFlexTopCenter)`
  gap: ${theme.spacing(0.8)};
  margin: ${theme.spacing(1.2, 3.2, 3.2)};
`;
