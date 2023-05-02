import { styled, Box } from '@mui/material';
import { theme, variables } from 'shared/styles';

export const StyledMark = styled(Box)`
  position: absolute;
  left: -2rem;
  border-radius: 100%;
  width: ${theme.spacing(0.6)};
  height: ${theme.spacing(0.6)};
  background-color: ${variables.palette.semantic.error};
`;
