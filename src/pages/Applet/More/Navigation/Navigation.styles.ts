import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';
import { StyledTitleSmall } from 'styles/styledComponents/Typography';

export const StyledContainer = styled(Box)`
  padding: ${theme.spacing(0, 1.2, 0.8)};
  margin: 0 auto;
  height: 100%;
`;

export const StyledRow = styled(StyledFlexAllCenter)`
  margin: ${theme.spacing(0, -1.2)};
  height: 100%;
`;

export const StyledCol = styled(Box)`
  padding: ${theme.spacing(0, 1.2)};
`;

export const StyledItem = styled(StyledFlexAllCenter)`
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg};
  width: 12rem;
  height: 12rem;
  padding: ${theme.spacing(1.2, 2.6)};
  flex-direction: column;
  text-align: center;
  cursor: pointer;

  :hover {
    background-color: ${variables.palette.on_surface_variant_alfa8_2};

    svg {
      fill: ${variables.palette.primary};
    }
  }
`;

export const StyledTitle = styled(StyledTitleSmall)`
  margin-top: ${theme.spacing(1)};
`;
