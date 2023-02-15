import { Box, ButtonGroup, FormControlLabel, TextField } from '@mui/material';
import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

const absolutePosition = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const StyledTextField = styled(TextField)`
  display: none;
`;

export const StyledLabel = styled(FormControlLabel)`
  &.MuiFormControlLabel-root {
    margin: 0;
  }
`;

export const StyledContainer = styled(StyledFlexAllCenter, shouldForwardProp)`
  border-radius: ${variables.borderRadius.lg2};

  ${({
    height,
    width,
    isImgUploaded,
  }: {
    height: number;
    width: number;
    isImgUploaded: boolean;
  }) => `
    height: ${height}rem;
    width: ${width}rem;
    border: ${variables.borderWidth.lg} ${isImgUploaded ? 'solid' : 'dashed'} ${
    variables.palette.outline_variant
  };
`}
`;

export const StyledImgContainer = styled(Box)`
  margin: 0 auto;
  text-align: center;
  svg {
    fill: ${variables.palette.surface_variant};
  }

  span {
    color: ${variables.palette.primary};
  }
`;

export const UploadedImgContainer = styled(Box)`
  position: relative;
`;

export const StyledButtonGroup = styled(ButtonGroup)`
  ${absolutePosition}

  .MuiButtonGroup-grouped {
    &:not(:first-of-type) {
      border-left: transparent;
    }
    &:not(:last-of-type):hover {
      border-right-color: transparent;
    }
  }

  .MuiButton-root.MuiButton-outlined {
    background-color: ${variables.palette.white};
    border-color: ${variables.palette.surface_variant};
    &:hover {
      background-color: ${variables.palette.white};
    }
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledUploadImg = styled('img', shouldForwardProp)`
  ${({ width, height, isMouseOver }: { width: number; height: number; isMouseOver: boolean }) => `
    width: ${width - 0.4}rem;
    height: ${height - 0.4}rem;
    filter: ${isMouseOver ? 'blur(0.5rem)' : 'none'};
  `}
  border-radius: ${variables.borderRadius.lg2};
  ${absolutePosition}
`;
