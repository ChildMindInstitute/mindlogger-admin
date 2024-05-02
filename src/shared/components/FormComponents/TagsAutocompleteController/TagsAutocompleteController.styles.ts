import { TextField, styled } from '@mui/material';

import { StyledFlexWrap } from 'shared/styles';

export const StyledTagsContainer = styled(StyledFlexWrap)`
  ${({ limitRows }: { limitRows?: number }) =>
    limitRows
      ? `
      overflow: auto;
      max-height: ${limitRows * 3.6}rem;
      `
      : ''}
`;

export const StyledTextField = styled(TextField)`
  ${({ limitRows }: { limitRows?: number }) =>
    limitRows
      ? `
      .MuiAutocomplete-input:not(:focus) {
        height: 0;
        padding: 0;
      }
      `
      : ''}
`;
