import { styled } from '@mui/system';

import {
  theme,
  variables,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  StyledTitleMedium,
  commonEllipsisStyles,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

const commonButtonStyles = `
  width: 4rem;
  height: 4rem;
  min-width: 4rem;`;

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  cursor: pointer;
  padding: ${theme.spacing(1.2, 1.2, 1.2, 2.2)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(1.6)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  .svg-checkbox-multiple-filled {
    stroke: ${variables.palette.on_surface_variant};
  }

  .actions {
    display: none;
  }

  .dots {
    display: flex;
    align-items: center;
    ${commonButtonStyles};
  }

  ${({ isActive }: { isActive: boolean }) =>
    isActive && `background: ${variables.palette.secondary_container};`}
  ${({ hasError }: { hasError: boolean }) =>
    hasError && `background: ${variables.palette.error_container};`}

  &:hover {
    ${({ isActive, hasError }: { isActive: boolean; hasError: boolean }) =>
      !isActive &&
      !hasError &&
      `
        background: ${variables.palette.surface_variant_alfa8};
    `}

    .actions {
      display: ${({ hidden }: { hidden?: boolean }) => (hidden ? 'none' : 'flex')};
    }

    .dots {
      display: ${({ hidden }: { hidden?: boolean }) => (hidden ? 'flex' : 'none')};
    }
  }
`;

export const StyledCol = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1)};
  margin-right: ${theme.spacing(2.8)};
  flex: 1 1 100%;
  min-width: 0;
`;

export const StyledDescription = styled(StyledTitleMedium)`
  ${commonEllipsisStyles}
`;

export const StyledTitle = styled(StyledTitleBoldMedium)`
  ${commonEllipsisStyles}
`;

export const StyledActionButton = styled(StyledClearedButton)`
  ${commonButtonStyles};
  border-radius: ${variables.borderRadius.half};
  margin-right: ${theme.spacing(1.9)};

  &:hover {
    background: ${variables.palette.secondary_container};

    svg {
      fill: ${variables.palette.primary};
    }
  }
`;
