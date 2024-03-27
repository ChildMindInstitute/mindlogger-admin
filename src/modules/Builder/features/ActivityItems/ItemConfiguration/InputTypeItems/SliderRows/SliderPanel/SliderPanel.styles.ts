import { Collapse, Slider, styled } from '@mui/material';

import { theme, variables, StyledFlexTopCenter } from 'shared/styles';
import { Table } from 'shared/components';

export const StyledSliderPanelContainer = styled(Collapse)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(2.4)};
  border-radius: ${variables.borderRadius.lg2};

  .MuiCollapse-wrapper {
    height: 100%;
  }
`;

export const StyledInputContainer = styled(StyledFlexTopCenter)`
  gap: 2.4rem;

  .MuiFormHelperText-root {
    position: absolute;
    bottom: -2.4rem;
    font-size: ${variables.font.size.md};
  }
`;

export const StyledTable = styled(Table)`
  .MuiTableCell-root {
    padding: ${theme.spacing(0, 0.5)};
  }
`;

export const StyledScoresContainer = styled(StyledFlexTopCenter)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.lg2};
  margin-top: ${theme.spacing(2.4)};
  position: relative;

  .MuiTableContainer-root {
    border: none;
    border-radius: 0;

    table {
      table-layout: fixed;
    }

    &:first-of-type {
      width: 13rem;
    }

    &:last-of-type {
      flex-grow: 1;
      overflow-y: hidden;
    }

    .MuiTableCell-head {
      color: ${variables.palette.outline};
    }

    .MuiTableCell-body {
      color: ${variables.palette.on_surface};
    }

    .MuiTableCell-head,
    .MuiTableCell-body {
      font-size: ${variables.font.size.md};
      line-height: ${variables.font.lineHeight.md};
      font-weight: ${variables.font.weight.regular};
      letter-spacing: ${variables.font.letterSpacing.lg};
    }
  }

  .MuiFormControl-root,
  .MuiBox-root {
    position: static;
  }
`;

export const StyledSlider = styled(Slider)`
  .MuiSlider-rail {
    color: ${variables.palette.surface_variant};
  }

  .MuiSlider-thumb {
    color: ${variables.palette.on_surface_variant};

    &:hover {
      box-shadow: ${variables.boxShadow.light1};
    }
  }

  .MuiSlider-mark {
    color: ${variables.palette.on_surface_alfa38};
  }

  .MuiSlider-markLabel {
    font-size: ${variables.font.size.sm};
    color: ${variables.palette.black};
  }

  .MuiSlider-thumb {
    display: flex;
  }
`;
