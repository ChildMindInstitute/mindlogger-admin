import { styled } from '@mui/system';
import { Box, List, ListItemButton } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledList = styled(List)`
  padding: ${theme.spacing(0.4, 2.4)};
`;

export const StyledListItemButton = styled(ListItemButton)`
  display: flex;
  padding: ${theme.spacing(1.4, 2)};
  border-radius: ${variables.borderRadius.xs};
`;

export const StyledBox = styled(Box)`
  padding: ${theme.spacing(0, 2)};
`;

export const StyledItemContent = styled(StyledFlexTopCenter)`
  flex: 1;
`;

export const StyledSelect = styled(Box)`
  text-align: center;
  width: 2.4rem;
`;
