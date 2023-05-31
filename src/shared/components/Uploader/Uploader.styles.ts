import { Box, ButtonGroup } from '@mui/material';
import { styled } from '@mui/system';

import { StyledFlexAllCenter, StyledFlexColumn } from 'shared/styles/styledComponents';
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
  cursor: pointer;
  flex-shrink: 0;

  ${({
    height,
    width,
    isImgUploaded,
    isPrimaryUiType,
  }: {
    height: number;
    width: number;
    isImgUploaded: boolean;
    isPrimaryUiType: boolean;
  }) => {
    const commonStyles = `
      height: ${height}rem;
      width: ${width}rem;
    `;

    if (isPrimaryUiType) {
      return `
        ${commonStyles}
        border: ${isImgUploaded ? variables.borderWidth.md : variables.borderWidth.lg} ${
        isImgUploaded ? 'solid' : 'dashed'
      } ${variables.palette.outline_variant};
        border-radius: ${variables.borderRadius.lg2};
      `;
    }

    return `
      ${commonStyles}
      border-radius: ${variables.borderRadius.xs};
      background-color: ${isImgUploaded ? 'transparent' : variables.palette.primary_container};
      
      .image-container {
        transition: ${variables.transitions.bgColor};
        padding: ${theme.spacing(0.7)};
        border-radius: ${variables.borderRadius.half};
      }
      
      &:hover {
        .image-container {
          background-color: ${variables.palette.on_surface_variant_alfa8};
        }
      }
    `;
  }}
`;

export const StyledImgContainer = styled(StyledFlexColumn, shouldForwardProp)`
  align-items: center;

  ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) =>
    isPrimaryUiType &&
    `
     span {
      color: ${variables.palette.primary};
     }
      
     svg {
      fill: ${variables.palette.surface_variant};
     }
  `};
`;

export const UploadedImgContainer = styled(Box, shouldForwardProp)`
  position: relative;
  ${({
    isPrimaryUiType,
    height,
    width,
  }: {
    isPrimaryUiType: boolean;
    height: number;
    width: number;
  }) => `
     width: ${width - 0.2}rem;
     height: ${height - 0.2}rem;
     ${
       !isPrimaryUiType &&
       `
      display: flex;
      align-items: center;
    `
     };
     `}
`;

export const StyledButtonGroup = styled(ButtonGroup, shouldForwardProp)`
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
      margin-left: ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) => !isPrimaryUiType && 0};
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
  ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) => `
    width: 100%;
    height: 100%;
    border-radius: ${isPrimaryUiType ? variables.borderRadius.lg2 : variables.borderRadius.xs};
    border: ${
      isPrimaryUiType
        ? 'none'
        : `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`
    };
  `}

  object-fit: contain;
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
