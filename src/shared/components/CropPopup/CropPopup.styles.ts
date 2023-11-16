import { Box, styled } from '@mui/material';

import { variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledCropWrapper = styled(Box, shouldForwardProp)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  overflow: hidden;
  display: flex;

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
        width: ${({ isSmallImg }: { isSmallImg: boolean }) => (isSmallImg ? '0.5rem' : '2.4rem')};
        height: ${({ isSmallImg }) => (isSmallImg ? '0.5rem' : '2.4rem')};
      }
    }

    &-n,
    &-s {
      &::after {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &-w,
    &-e {
      &::after {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
`;
