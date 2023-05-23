import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

export const StyledTitle = styled(StyledFlexTopCenter)`
  & .MuiBadge-root {
    position: relative;
    top: unset;
    right: unset;
    margin-right: ${theme.spacing(1.2)};
  }
`;
