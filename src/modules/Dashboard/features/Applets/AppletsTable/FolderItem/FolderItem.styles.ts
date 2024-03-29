import { OutlinedInput, styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  StyledClearedButton,
  StyledLabelSmall,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledCloseButton = styled(StyledClearedButton)`
  border-radius: ${variables.borderRadius.half};
  padding: 0.4rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledFolderIcon = styled(StyledFlexAllCenter)`
  height: 3.2rem;
  width: 3.2rem;
  margin-right: ${theme.spacing(1.2)};
`;

export const StyledFolderName = styled(StyledFlexTopCenter)`
  position: relative;
  flex-wrap: wrap;
`;

export const StyledCountApplets = styled(StyledLabelSmall)`
  color: ${variables.palette.outline};
  margin-left: ${theme.spacing(0.4)};
`;

export const StyledOutlinedInput = styled(OutlinedInput)`
  .MuiInputBase-input {
    padding: ${theme.spacing(1, 1.4)};
  }
`;
