import MdEditor from 'md-editor-rt';
import styled from '@emotion/styled/macro';
import { Box } from '@mui/material';

import {
  theme,
  variables,
  StyledFlexColumn,
  StyledFlexTopStart,
  StyledSvgArrowContainer,
} from 'shared/styles';

import { ActivityItemGrid } from '../Activity/Activity.styles';

export const StyledItemContainer = styled(StyledFlexColumn)`
  ${ActivityItemGrid};
  align-items: start;
  padding: ${theme.spacing(0.8, 2.4)};

  &:not(:last-child) {
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  }

  .MuiFormControlLabel-root {
    margin: 0;
  }
`;

export const StyledItemHeader = styled(Box)`
  ${ActivityItemGrid};
  column-gap: 0.4rem;
  cursor: pointer;

  &:hover {
    ${StyledSvgArrowContainer} {
      background-color: ${variables.palette.on_surface_alfa8};
    }
  }
`;

export const StyledMdEditor = styled(MdEditor)`
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

export const StyledItemContent = styled(Box)`
  grid-column-start: 2;
  margin: ${theme.spacing(1.8, 0, 1.8, 4.8)};
`;

export const StyledItemContentRow = styled(StyledFlexTopStart)`
  &:not(:first-of-type) {
    margin-top: ${theme.spacing(0.8)};
  }
`;

export const StyledItemSvg = styled(Box)`
  margin-right: ${theme.spacing(1.6)};

  svg {
    fill: ${variables.palette.outline};
  }

  .svg-checkbox-multiple-filled {
    stroke: ${variables.palette.outline};
  }
`;

export const StyledItemImage = styled('img')`
  width: 2.4rem;
  height: 2.4rem;
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.xs};
  margin-right: ${theme.spacing(1.6)};
`;
