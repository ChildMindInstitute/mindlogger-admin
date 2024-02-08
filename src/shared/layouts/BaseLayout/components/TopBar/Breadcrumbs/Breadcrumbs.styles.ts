import { styled, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

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
  transition: ${variables.transitions.bgColor};
  border-radius: ${variables.borderRadius.lg};
  height: 4rem;

  &:hover {
    background-color: ${variables.palette.on_surface_variant_alfa8};
  }
`;

export const StyledBox = styled(Box)`
  ${commonCenterStyles};
  padding: ${theme.spacing(0.8)};
`;

export const StyledChip = styled(Box)`
  padding: ${theme.spacing(0.6, 1)};
  margin-left: ${theme.spacing(0.8)};
  background-color: ${variables.palette.on_surface_variant_alfa8};
  border-radius: ${variables.borderRadius.xs};
`;
