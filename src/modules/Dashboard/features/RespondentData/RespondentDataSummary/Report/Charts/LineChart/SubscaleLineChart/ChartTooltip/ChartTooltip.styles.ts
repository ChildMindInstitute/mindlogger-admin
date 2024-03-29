import { Box, styled } from '@mui/material';

import { MarkDownPreview } from 'shared/components';
import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  min-width: 20rem;
  max-width: 32rem;
  max-height: 32rem;
  overflow-y: auto;
  background-color: ${variables.palette.surface2};
  border-radius: ${variables.borderRadius.lg};
  box-shadow: ${variables.boxShadow.light2};
  padding: ${theme.spacing(1.6, 2.4)};
`;

export const StyledBackground = styled(Box)`
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
`;

export const StyledMdPreview = styled(MarkDownPreview)`
  background-color: transparent;
  color: ${variables.palette.on_surface_variant};
  font-size: ${variables.font.size.md};
  font-weight: normal;
  text-align: initial;
  padding: ${theme.spacing(0.7, 0)};

  .default-theme {
    p {
      padding: 0;
    }

    img {
      padding: 0;
      border: none;
    }

    table tbody tr {
      background: transparent;
    }

    .figcaption {
      display: none;
    }
  }
`;
