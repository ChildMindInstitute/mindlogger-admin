import { styled, TableCell } from '@mui/material';

import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexAllCenter, StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledLabelSmall } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledCloseButton = styled(StyledClearedButton)`
  border-radius: ${variables.borderRadius.half};
  padding: 0.4rem;
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

export const StyledCell = styled(TableCell)`
  position: relative;

  &:hover {
    .cell-actions {
      display: flex;
    }
  }
`;
