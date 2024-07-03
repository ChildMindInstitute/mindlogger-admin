import { Button, styled } from '@mui/material';

import { StyledClearedButton } from 'shared/styles';

export const StyledLinkBtn = styled(StyledClearedButton)`
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  vertical-align: unset;

  && {
    padding: 0;
  }

  &.MuiButton-text:hover {
    background-color: transparent;
  }
` as typeof Button;
