import { styled, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

const commonImgStyles = `
  width: 3.2rem;
  height: 3.2rem;
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.xxs};
  flex-shrink: 0;
`;

export const StyledSmallAppletImg = styled('img')`
  ${commonImgStyles};
`;

export const StyledSmallAppletImgPlaceholder = styled(Box)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
`;

export const StyledLogo = styled('img')({
  width: '4.8rem',
  height: '4.8rem',
  borderRadius: variables.borderRadius.md,
});
