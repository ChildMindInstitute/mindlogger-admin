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

const commonImgStyles = `
  width: 1.8rem;
  height: 1.8rem;
  border-radius: ${variables.borderRadius.xs};
`;

export const StyledIconWrapper = styled(StyledFlexAllCenter)`
  margin-right: ${theme.spacing(0.625)};
`;

export const StyledIconImg = styled('img')`
  ${commonImgStyles};
`;

export const StyledPlaceholder = styled(StyledFlexAllCenter)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
`;

export const StyledLink = styled(Link)`
  ${commonCenterStyles};
  padding: ${theme.spacing(0.8)};
  transition: background-color 0.3s;
  border-radius: ${variables.borderRadius.lg};

  &:hover {
    background-color: ${variables.palette.on_surface_variant_alfa8};
  }
`;

export const StyledBox = styled(Box)`
  ${commonCenterStyles};
  padding: ${theme.spacing(0.8)};
`;
