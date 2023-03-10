import { styled } from '@mui/system';
import { TextField } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

export const StyledRow = styled(StyledFlexTopCenter)`
  width: 100%;
  margin-bottom: ${theme.spacing(1.6)};
`;

export const StyledTextField = styled(TextField)`
  margin-right: ${theme.spacing(1.6)};
  flex-grow: 1;
`;

export const StyledMaxCharacters = styled(StyledFlexTopCenter)`
  width: 20rem;
`;
