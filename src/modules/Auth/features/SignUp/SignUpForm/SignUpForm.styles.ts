import { styled } from '@mui/system';
import { Button, Box, Link } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import {
  StyledHeadline,
  StyledLabelMedium,
  StyledClearedButton,
} from 'shared/styles/styledComponents';

export const StyledSignUpHeader = styled(StyledHeadline)`
  margin: ${theme.spacing(0, 0, 2.4)};
`;

export const StyledForm = styled('form')`
  padding: ${theme.spacing(2.4)};
  background-color: ${variables.palette.white};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xl};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledLabel = styled(StyledLabelMedium)`
  margin: 0;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${variables.palette.primary};

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
`;

export const StyledBack = styled(StyledClearedButton)`
  color: ${variables.palette.primary};
  text-align: center;
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.sm};
  text-decoration: underline;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;
