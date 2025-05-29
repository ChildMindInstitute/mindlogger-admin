import { Box, styled } from '@mui/material';

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

export const StyledIconWrapper = styled(Box)({
  width: '2.4rem',
  height: '2.4rem',
  overflow: 'hidden',
  borderRadius: '100%',
  position: 'relative',
  backgroundColor: '#fdfcfc',
});

export const StyledIcon = styled('img')({
  width: '3.4rem',
  height: '3.4rem',
  objectFit: 'cover',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});
