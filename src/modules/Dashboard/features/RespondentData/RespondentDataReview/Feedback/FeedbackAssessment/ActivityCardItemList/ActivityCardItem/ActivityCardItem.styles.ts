import { Box, styled } from '@mui/material';

import { MarkDownEditor } from 'shared/components';
import { theme, variables } from 'shared/styles';

export const StyledCardItemContainer = styled(Box)`
  padding-bottom: ${theme.spacing(3.2)};

  &:not(:first-of-type) {
    padding-top: ${theme.spacing(3.2)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;

export const StyledMdEditor = styled(MarkDownEditor)`
  background-color: transparent;
  color: ${variables.palette.on_surface_variant};
  font-size: ${variables.font.size.md};
  font-weight: normal;
  text-align: initial;
  padding: ${theme.spacing(0.7, 0)};
  margin-bottom: ${theme.spacing(1.6)};

  .default-theme {
    p {
      padding: 0;
      word-break: break-word;
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
