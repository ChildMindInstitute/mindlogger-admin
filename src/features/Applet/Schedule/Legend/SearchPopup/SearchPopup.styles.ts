import { styled } from '@mui/system';
import { Button, DialogTitle, Dialog, DialogActions, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { FontWeight } from 'styles/styledComponents/Typography';
import { shouldForwardProp } from 'utils/shouldForwardProp';
import { Modal } from 'components';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledModal = styled(Box)`
  background-color: ${variables.palette.surface2};
  width: 66rem;
  height: 35.2rem;
  overflow: auto;
  max-width: 100rem;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  border-radius: 28px;
  padding: ${theme.spacing(0, 0.4, 0.8)};
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
`;

export const StyledChecked = styled(Box)`
  margin-left: auto;
  display: flex;
`;
