import { Box, styled } from '@mui/material';

import { StyledBodyMedium, StyledFlexColumn } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const absolutePosition = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const getContainerSecondaryStyles = (isImgUploaded: boolean, hasError?: boolean) => `
  border-radius: ${variables.borderRadius.xs};
  background-color: ${isImgUploaded ? 'transparent' : variables.palette.primary_container};
  border: ${hasError ? `${variables.borderWidth.md} solid ${variables.palette.error}` : 'unset'};

  .image-container {
    transition: ${variables.transitions.bgColor};
    padding: ${theme.spacing(0.7)};
    border-radius: ${variables.borderRadius.half};
  }

  &:hover {
    .image-container {
      background-color: ${variables.palette.on_surface_variant_alpha8};
    }
  }
`;

export const StyledContainer = styled('button', shouldForwardProp)`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  position: relative;

  ${({
    height,
    width,
    isImgUploaded,
    isPrimaryUiType,
    hasError,
    disabled,
  }: {
    height: number;
    width: number;
    isImgUploaded: boolean;
    isPrimaryUiType: boolean;
    hasError?: boolean;
    disabled?: boolean;
  }) => {
    const commonStyles = `
      height: ${hasError ? height - 0.1 : height}rem;
      width: ${hasError ? width - 0.1 : width}rem;
      opacity: ${disabled ? '0.5' : '1'};
      cursor: ${disabled ? 'default' : 'pointer'};
      pointer-events: ${disabled ? 'none' : 'auto'};
    `;

    if (isPrimaryUiType) {
      return `
        ${commonStyles};
        border: ${isImgUploaded ? variables.borderWidth.md : variables.borderWidth.lg} ${
          isImgUploaded ? 'solid' : 'dashed'
        } ${variables.palette.outline_variant};
        border-radius: ${variables.borderRadius.lg2};
      `;
    }

    return `
      ${commonStyles};
      ${getContainerSecondaryStyles(isImgUploaded, hasError)};
    `;
  }}
`;

export const StyledImgContainer = styled(StyledFlexColumn, shouldForwardProp)`
  align-items: center;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  ${({ isPrimaryUiType, hasError }: { isPrimaryUiType: boolean; hasError?: boolean }) => {
    if (isPrimaryUiType) {
      return `
         span {
          color: ${variables.palette.primary};
         }

         svg {
          fill: ${variables.palette.surface_variant};
         }
      `;
    }

    if (!isPrimaryUiType && hasError) {
      return `
         svg {
          fill: ${variables.palette.error};
         }
      `;
    }
  }};
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
  font-size: ${variables.font.size.label3};
  line-height: ${variables.font.lineHeight.label3};
  color: ${variables.palette.on_surface_variant};
  margin-top: ${theme.spacing(1.6)};
  display: flex;

  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledError = styled(StyledBodyMedium)`
  margin-bottom: ${theme.spacing(1)};
  padding: ${theme.spacing(0, 3)};
  text-align: center;
  color: ${variables.palette.error};
`;
