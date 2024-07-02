import { styled } from '@mui/material';

import { StyledFlexTopCenter, variables } from 'shared/styles';

import { StyledSelectionRow } from '../Options/Options.styles';

export const StyledSelectionRowItem = styled(StyledSelectionRow)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};

  && .Mui-disabled {
    color: ${variables.palette.on_surface_variant};

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;

export const StyledItemContainer = styled(StyledFlexTopCenter)`
  min-height: 5.5rem;
  justify-content: center;
  gap: 1.2rem;
`;
