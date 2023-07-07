import { styled, Box } from '@mui/material';
import { StyledLabelBoldLarge, commonEllipsisStyles, theme, variables } from 'shared/styles';

export const StyledMark = styled(Box)`
  position: absolute;
  left: -2rem;
  border-radius: ${variables.borderRadius.half};
  width: ${theme.spacing(0.6)};
  height: ${theme.spacing(0.6)};
  background-color: ${variables.palette.semantic.error};
`;

export const StyledTitle = styled(StyledLabelBoldLarge)`
  ${commonEllipsisStyles};
`;
