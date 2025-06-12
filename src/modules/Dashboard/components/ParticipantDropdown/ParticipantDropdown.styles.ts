import { Box, styled, TextField } from '@mui/material';

import { StyledFlexTopCenter, StyledLabelBoldLarge, theme, variables } from 'shared/styles';

export const StyledGroupLabel = styled(StyledLabelBoldLarge)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${variables.palette.on_surface_variant};
  padding: ${theme.spacing(1.6, 1.6, 0.4)};
`;

export const StyledTextFieldWrapper = styled(Box)(
  ({ isShaded }: { isShaded?: boolean }) => `
    position: relative;
    transition: ${variables.transitions.bgColor};
    ${
      isShaded &&
      `&:hover {
        background-color: ${variables.palette.on_surface_variant_alpha8};
      }`
    }
  `,
);

export const StyledTextField = styled(TextField)(
  ({
    isSnippetVisible,
    isFullVariant,
  }: {
    isSnippetVisible?: boolean;
    isFullVariant?: boolean;
  }) => `
    .MuiOutlinedInput-notchedOutline {
      ${isFullVariant && 'border: 0'};
    }
    .MuiInputBase-input {
      ${isSnippetVisible && 'color: transparent'};
    }
  `,
);

export const StyledEmptyError = styled(StyledFlexTopCenter)(
  ({ isFullVariant }: { isFullVariant?: boolean }) => `
    position: absolute;
    inset: 0;
    pointer-events: none;
    margin: ${theme.spacing(0, 4.8, 0, isFullVariant ? 3.2 : 1.6)};
  `,
);
