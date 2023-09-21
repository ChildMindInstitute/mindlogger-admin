import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

export const StyledWrapper = styled(StyledFlexTopCenter)`
  position: relative;
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;
