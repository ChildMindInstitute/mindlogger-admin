import { Button, styled, Box } from '@mui/material';

import { MarkDownPreview } from 'shared/components';
import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledMdPreview = styled(MarkDownPreview)`
  --md-bk-color: transparent;
  margin-bottom: ${theme.spacing(2.4)};

  .default-theme {
    p {
      padding: 0;
      word-break: break-word;
    }

    img {
      width: 100%;
      height: auto;
    }

    background-color: transparent;
    color: ${variables.palette.on_surface};
    font-size: ${variables.font.size.lrg};
    line-height: ${variables.font.lineHeight.xl};
    color: ${variables.palette.on_surface};
    font-weight: normal;
    text-align: initial;
  }
`;

export const StyledCollapsedContainer = styled(Box, shouldForwardProp)`
  overflow-y: hidden;

  max-height: ${({ maxHeight, isOpen }: { maxHeight: number; isOpen: boolean; isLarge: boolean }) =>
    !isOpen ? `${maxHeight}px` : 'unset'};
  border-bottom: ${({ isOpen, isLarge }) =>
    isLarge && !isOpen
      ? `${variables.borderWidth.md} solid ${variables.palette.outline_variant}`
      : 'unset'};
`;

export const StyledBtn = styled(Button)`
  margin-left: ${theme.spacing(-2)};

  &.MuiButton-text:hover {
    text-decoration-line: underline;
    background-color: unset;
  }
`;
