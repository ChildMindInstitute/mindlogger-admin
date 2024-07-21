import { styled, TextField } from '@mui/material';

import { StyledFlexTopCenter, StyledLabelBoldLarge, theme, variables } from 'shared/styles';

export const StyledGroupLabel = styled(StyledLabelBoldLarge)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${variables.palette.on_surface_variant};
  padding: ${theme.spacing(1.6, 1.6, 0.4)};
`;

export const StyledTextField = styled(TextField)(
  ({ isSnippetVisible }: { isSnippetVisible?: boolean }) => `
    .MuiInputBase-input {
      ${isSnippetVisible && 'color: transparent'};
    }
  `,
);

export const StyledEmptyError = styled(StyledFlexTopCenter)(
  () => `
    position: absolute;
    inset: 0;
    pointer-events: none;
    margin: ${theme.spacing(0, 4.8, 0, 1.6)};
  `,
);
