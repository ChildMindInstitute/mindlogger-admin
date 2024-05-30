import { styled } from '@mui/material';

import { StyledFlexTopCenter, StyledLabelBoldLarge, theme, variables } from 'shared/styles';

export const StyledWarningMessageContainer = styled(StyledFlexTopCenter)`
  gap: 1.6rem;
  background-color: ${variables.palette.yellow_light};
  padding: ${theme.spacing(0.8, 1.6)};
  margin-top: -1.6rem;
  border-bottom-left-radius: ${variables.borderRadius.sm};
  border-bottom-right-radius: ${variables.borderRadius.sm};
`;

export const StyledGroupLabel = styled(StyledLabelBoldLarge)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${variables.palette.on_surface_variant};
  padding: ${theme.spacing(1.6, 1.6, 0.4)};
`;
