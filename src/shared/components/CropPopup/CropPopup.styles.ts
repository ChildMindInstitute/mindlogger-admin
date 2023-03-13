import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'shared/styles/variables';

export const StyledCropWrapper = styled(Box)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  overflow: hidden;

  .cropper-modal {
    opacity: 0.4;
  }

  .cropper-view-box {
    outline-color: ${variables.palette.white};
  }

  .cropper-line {
    background-color: transparent;
  }

  .cropper-point {
    width: 2.4rem;
    height: 2.4rem;
    background: ${variables.palette.white};
    opacity: 1;
  }

  .cropper-point.point-n,
  .cropper-point.point-ne,
  .cropper-point.point-nw {
    top: 0;
  }

  .cropper-point.point-nw,
  .cropper-point.point-sw,
  .cropper-point.point-w {
    left: 0;
  }

  .cropper-point.point-w,
  .cropper-point.point-e {
    margin-top: 0;
    transform: translateY(-50%);
  }

  .cropper-point.point-n,
  .cropper-point.point-s {
    margin-left: 0;
    transform: translateX(-50%);
  }

  .cropper-point.point-ne,
  .cropper-point.point-e,
  .cropper-point.point-se {
    right: 0;
  }

  .cropper-point.point-se,
  .cropper-point.point-s,
  .cropper-point.point-sw {
    bottom: 0;
  }
`;
