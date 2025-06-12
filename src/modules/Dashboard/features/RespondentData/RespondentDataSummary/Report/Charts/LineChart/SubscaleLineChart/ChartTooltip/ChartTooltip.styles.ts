import { Box, styled } from '@mui/material';

import { MarkDownPreview } from 'shared/components';
import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  min-width: 38rem;
  max-width: 62rem;
  max-height: 62rem;
  overflow-y: auto;

  background-color: ${variables.palette.surface2};
  border-radius: ${variables.borderRadius.lg};
  box-shadow: ${variables.boxShadow.light2};
  padding: ${theme.spacing(2.4)};
  margin: ${theme.spacing(0, 1.6, 0, 0)};

  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2.4)};
`;

export const StyledBackground = styled(Box)`
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
`;

export const StyledMdPreview = styled(MarkDownPreview)`
  background-color: transparent;
  font-size: ${variables.font.size.label1};
  font-weight: normal;
  text-align: initial;

  .md-editor-preview-wrapper {
    padding: 0;
  }

  .default-theme {
    p {
      padding: 0;
      word-break: break-word;
      font-size: ${variables.font.size.label1};
      color: ${variables.palette.on_surface};
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
