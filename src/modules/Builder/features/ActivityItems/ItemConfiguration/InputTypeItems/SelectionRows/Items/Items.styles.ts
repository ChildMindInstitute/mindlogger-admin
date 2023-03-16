import { styled } from '@mui/material';

import { variables } from 'shared/styles';

import { StyledSelectionRow } from '../SelectionRows.styles';

export const StyledSelectionRowItem = styled(StyledSelectionRow)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;
