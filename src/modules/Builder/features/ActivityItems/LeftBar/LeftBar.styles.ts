import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledHeadlineLarge } from 'shared/styles/styledComponents';
import { commonStickyStyles } from 'shared/styles/stylesConsts';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledBar = styled(Box)`
  width: 40rem;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  overflow-y: auto;
`;

export const StyledHeader = styled(StyledHeadlineLarge, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(2.8, 1.6, 2, 5.6)};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(0, 1.6, 2.8)};
`;

export const StyledBtnWrapper = styled(Box)`
  text-align: center;

  svg {
    fill: ${variables.palette.primary};
  }
`;
