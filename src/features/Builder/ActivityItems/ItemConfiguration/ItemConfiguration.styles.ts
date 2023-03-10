import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';
import { StyledFlexColumn, StyledFlexTopCenter } from 'styles/styledComponents';
import { commonStickyStyles } from 'styles/stylesConsts';

export const StyledItemConfiguration = styled(StyledFlexColumn)`
  position: relative;
  height: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

export const StyledHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};
  justify-content: space-between;
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  padding: ${theme.spacing(2.8, 6.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(2.8, 6.4)};
`;

export const StyledInputWrapper = styled(Box)`
  width: 58rem;
`;

export const StyledOptionsWrapper = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
  text-align: center;
`;
