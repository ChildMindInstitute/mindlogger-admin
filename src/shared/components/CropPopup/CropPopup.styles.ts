import { Box, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledCropWrapper = styled(Box)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  overflow: hidden;
  width: fit-content;
  height: fit-content;

  && .ReactCrop__crop-selection {
    background-image: unset;
    border: ${variables.borderWidth.md} solid ${variables.palette.white};
  }

  .ReactCrop__drag-handle.ord {
    &-nw,
    &-se,
    &-ne,
    &-sw,
    &-w,
    &-e,
    &-n,
    &-s {
      display: block;
      margin: 0;

      &::after {
        background: ${variables.palette.white};
        width: 2.4rem;
        height: 2.4rem;
      }
    }
  }
`;
