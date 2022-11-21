import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';

const commonCenterStyles = `
  display: flex;
  align-items: center;
  text-decoration: none;
`;

export const StyledAvatarWrapper = styled(StyledFlexAllCenter)`
  margin-right: ${theme.spacing(0.8)};
`;

export const StyledAvatar = styled(Box)`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: ${variables.borderRadius.half};
  background-color: ${variables.palette.primary_container};
`;

export const StyledLink = styled(Link)`
  ${commonCenterStyles};
  padding: ${theme.spacing(0.8, 0.4)};
  transition: background-color 0.3s;
  border-radius: ${variables.borderRadius.lg};

  &:hover {
    background-color: ${variables.palette.primary50_alfa5};

    p {
      color: ${variables.palette.primary};
    }
  }
`;

export const StyledBox = styled(Box)`
  ${commonCenterStyles}
`;
