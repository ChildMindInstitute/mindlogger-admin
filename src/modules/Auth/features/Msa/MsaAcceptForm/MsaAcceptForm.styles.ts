import { styled } from '@mui/material';

import { StyledFlexColumn, theme } from 'shared/styles';

// Paragraphs, error and checkbox sit one blank line apart, as in the Figma dialogue
export const StyledMsaBody = styled(StyledFlexColumn)`
  gap: ${theme.spacing(2.4)};
  padding: ${theme.spacing(2.4, 3.2)};
`;
