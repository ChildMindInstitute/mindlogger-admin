import { styled } from '@mui/material';

import { StyledBodyLarge, StyledTitleLargish, theme } from 'shared/styles';

export const StyledHelpTitle = styled(StyledTitleLargish)({
  marginTop: theme.spacing(2.4),
});

export const StyledHelpParagraph = styled(StyledBodyLarge)({
  marginTop: theme.spacing(1.6),
});
