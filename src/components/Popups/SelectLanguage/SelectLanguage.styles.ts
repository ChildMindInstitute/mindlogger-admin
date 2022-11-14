import { styled } from '@mui/system';
import { Box, Button, List, ListItemButton } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledList = styled(List)`
  padding: ${theme.spacing(0.4, 2.4)};
`;

export const StyledListItemButton = styled(ListItemButton)`
  display: flex;
  padding: ${theme.spacing(1.4, 2)};
  border-radius: 1.2rem;
`;

export const StyledBox = styled(Box)`
  padding: ${theme.spacing(0, 2)};
`;

export const StyledItemContent = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const StyledSelect = styled(Box)`
  text-align: center;
  width: 2.4rem;
`;

export const StyledCancelButton = styled(Button)`
  font-weight: ${variables.font.weight.regular};
`;

export const StyledOkButton = styled(Button)`
  font-weight: ${variables.font.weight.semiBold};
`;
