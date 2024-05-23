import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledRoot = styled(Box)({
  borderRadius: variables.borderRadius.lg2,
  boxShadow: '0px 0px 16px 0px #00000014',
  display: 'flex',
  gap: theme.spacing(6.4),
  margin: 0,
  padding: theme.spacing(2, 2.4),
  position: 'relative',

  '& li:nth-of-type(n + 2):before': {
    background: variables.palette.neutral90,
    bottom: 0,
    content: '""',
    left: -32,
    position: 'absolute',
    top: 0,
    width: 1,
  },
});
