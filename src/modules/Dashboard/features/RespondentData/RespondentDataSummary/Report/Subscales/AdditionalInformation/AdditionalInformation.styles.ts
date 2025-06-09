import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { MarkDownPreview } from 'shared/components';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledHeader = styled(StyledFlexTopCenter)`
  margin-bottom: ${theme.spacing(1.6)};

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(1.6)};
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.lg2};
  max-height: 28.8rem;
  overflow: auto;
`;

export const StyledMdPreview = styled(MarkDownPreview)`
  background-color: transparent;
  color: ${variables.palette.on_surface_variant};
  font-size: ${variables.font.size.label3};
  font-weight: normal;
  text-align: initial;
  padding: ${theme.spacing(0.7, 0)};

  .md-editor-content .md-editor-preview {
    word-break: break-word;
  }

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
