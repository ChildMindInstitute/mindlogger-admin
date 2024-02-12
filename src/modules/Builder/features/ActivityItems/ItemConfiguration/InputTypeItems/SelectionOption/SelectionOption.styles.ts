import { styled, Box } from '@mui/material';

import { theme, variables, StyledFlexColumn, StyledFlexTopCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';
import { StyledItemOptionContainer } from 'modules/Builder/components/ToggleItemContainer/ToggleItemContainer.styles';

export const StyledItemOption = styled(StyledItemOptionContainer, shouldForwardProp)`
  padding: ${theme.spacing(2, 2.4, 2, 3.4)};
  height: ${({ optionOpen }: { optionOpen: boolean; leftBorderColor?: string }) => (optionOpen ? 'auto' : '8.8rem')};
  justify-content: center;
  position: relative;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2.4rem;
    height: 100%;
    border-top-left-radius: ${variables.borderRadius.lg2};
    border-bottom-left-radius: ${variables.borderRadius.lg2};
    background-color: ${({ leftBorderColor }) => leftBorderColor || 'transparent'};
  }
`;

export const StyledSvgWrapper = styled(StyledFlexTopCenter)`
  svg {
    fill: ${variables.palette.on_surface_variant};

    &.svg-checkbox-multiple-filled {
      stroke: ${variables.palette.on_surface_variant};
    }
  }
`;

export const StyledCollapsedWrapper = styled(StyledFlexTopCenter)`
  margin: ${theme.spacing(0, 1)};
`;

export const StyledTextInputWrapper = styled(Box, shouldForwardProp)`
  flex-grow: 1;
  margin-right: ${({ hasScores }: { hasScores: boolean }) => (hasScores ? theme.spacing(1) : 0)};
`;

export const StyledScoreWrapper = styled(Box)`
  width: 15.4rem;
`;

export const StyledTooltipWrapper = styled(StyledFlexColumn)`
  width: calc(100% - 10.9rem);
  margin-left: auto;
  text-align: right;
`;

export const StyledImg = styled('img')`
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  width: 5.4rem;
  height: 5.4rem;
  border-radius: ${variables.borderRadius.xs};
  object-fit: cover;
`;
