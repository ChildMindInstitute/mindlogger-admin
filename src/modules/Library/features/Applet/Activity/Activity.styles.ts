import styled from '@emotion/styled/macro';
import { Box, FormControlLabel } from '@mui/material';

import { StyledSvgArrowContainer, StyledTitleBoldMedium, theme, variables } from 'shared/styles';

export const ActivityItemGrid = `
  display: grid;
  grid-template-columns: 4rem auto;
  column-gap: 0.2rem;
`;

export const StyledActivityContainer = styled(Box)`
  ${ActivityItemGrid};
  align-items: start;
  background: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg};
  padding: ${theme.spacing(1.6, 2)};

  &:not(:last-child) {
    margin-bottom: ${theme.spacing(0.8)};
  }
`;

export const StyledActivityHeader = styled(Box)`
  ${ActivityItemGrid};
  column-gap: 0.4rem;
  cursor: pointer;

  &:hover {
    ${StyledSvgArrowContainer} {
      background-color: ${variables.palette.on_surface_alpha8};
    }
  }
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 0;
`;

export const StyledActivityName = styled(StyledTitleBoldMedium)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing(0.7, 0)};
  color: ${variables.palette.on_surface_variant};
`;

export const StyledItemsList = styled(Box)`
  grid-column-start: 2;
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.lg2};
  margin: ${theme.spacing(1.8, 0, 1.8, 4.8)};
`;
