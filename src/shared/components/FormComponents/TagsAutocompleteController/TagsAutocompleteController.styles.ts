import { TextField, styled } from '@mui/material';

import { StyledFlexWrap } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledTagsContainer = styled(StyledFlexWrap, shouldForwardProp)`
  ${({ limitRows }: { limitRows?: number }) =>
    limitRows
      ? `
      overflow: auto;
      max-height: ${limitRows * 3.6}rem;
      `
      : ''}
`;

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'limitRows',
})`
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
