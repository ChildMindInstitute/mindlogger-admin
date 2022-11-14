import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

const commonCenterStyles = `
  display: flex;
  align-items: center;
  text-decoration: none;
`;

export const StyledAvatarWrapper = styled(Box)`
  margin-right: ${theme.spacing(0.8)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledAvatar = styled(Box)`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: ${variables.borderRadius.half};
  background-color: ${variables.palette.primary80};
`;

export const StyledLink = styled(Link)`
  ${commonCenterStyles};
  padding: ${theme.spacing(0.8, 0.4)};
  transition: background-color 0.3s;
  border-radius: ${variables.borderRadius.lg};

  &:hover {
    background-color: ${variables.palette.primary50_alfa5};

    p {
      color: ${variables.palette.primary50};
    }
  }
`;

export const StyledBox = styled(Box)`
  ${commonCenterStyles}
`;
