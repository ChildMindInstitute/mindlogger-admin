import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

const commonImgStyles = `
  width: 3.2rem;
  height: 3.2rem;
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.xxs};
`;

export const StyledSmallAppletImg = styled('img')`
  ${commonImgStyles};
`;

export const StyledSmallAppletImgPlaceholder = styled(Box)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
`;
