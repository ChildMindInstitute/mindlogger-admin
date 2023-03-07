import { Box, ButtonGroup } from '@mui/material';
import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

const absolutePosition = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const StyledContainer = styled(StyledFlexAllCenter, shouldForwardProp)`
  border-radius: ${variables.borderRadius.lg2};
  cursor: pointer;

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
    border: ${isImgUploaded ? variables.borderWidth.md : variables.borderWidth.lg} ${
    isImgUploaded ? 'solid' : 'dashed'
  } ${variables.palette.outline_variant};
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

    .MuiButton-startIcon {
      margin-right: 0;
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
  ${({ width, height }: { width: number; height: number }) => `
    width: ${width - 0.2}rem;
    height: ${height - 0.2}rem;
  `}
  border-radius: ${variables.borderRadius.lg2};
  object-fit: cover;
  ${absolutePosition}
`;

export const StyledName = styled(Box)`
  color: ${variables.palette.primary};
  font-weight: ${variables.font.weight.bold};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 17rem;
`;

export const StyledNameWrapper = styled(Box)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  color: ${variables.palette.on_surface_variant};
  margin-top: ${theme.spacing(1.6)};
  display: flex;

  svg {
    fill: ${variables.palette.primary};
  }
`;
