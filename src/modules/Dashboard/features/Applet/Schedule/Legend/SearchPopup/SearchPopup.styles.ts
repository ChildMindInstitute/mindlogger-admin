import { styled, Box, Modal } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter, StyledClearedButton } from 'shared/styles/styledComponents';

export const StyledModal = styled(Modal)`
  position: absolute;
`;

export const StyledModalInner = styled(Box)`
  background-color: ${variables.palette.surface2};
  width: 66rem;
  height: 35.2rem;
  max-width: 100rem;
  box-shadow: ${variables.boxShadow.light2};
  border-radius: ${variables.borderRadius.xxl};
  padding: ${theme.spacing(2, 0.4, 2.8)};
  display: flex;
`;

export const StyledItemsContainer = styled(Box)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
  padding: ${theme.spacing(1.6, 2.4, 1.6, 1.4)};
  background-color: ${({ background }: { background?: string }) => background || 'transparent'};
`;

export const StyledClearBtn = styled(StyledClearedButton)`
  margin-right: ${theme.spacing(1.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledChecked = styled(Box)`
  margin-left: auto;
  display: flex;
`;
