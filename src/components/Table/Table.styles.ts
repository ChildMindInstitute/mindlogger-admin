import { styled, TableContainer } from '@mui/material';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledTableContainer = styled(TableContainer)`
  height: ${({ height }: { height: string }) => height || 'auto'};
`;

export const StyledTableCellContent = styled(StyledFlexTopCenter)`
  justify-content: flex-end;
`;
