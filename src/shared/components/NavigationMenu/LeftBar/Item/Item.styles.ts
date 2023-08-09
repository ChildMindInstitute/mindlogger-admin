import { styled } from '@mui/system';

import {
  theme,
  variables,
  StyledFlexColumn,
  commonEllipsisStyles,
  StyledLabelLarge,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(StyledFlexColumn, shouldForwardProp)`
  cursor: pointer;
  padding: ${theme.spacing(0, 2.6, 1.2)};
  border-radius: ${variables.borderRadius.lg};
  width: 12rem;
  height: 12rem;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  margin-top: ${theme.spacing(0.2)};

  :hover {
    background-color: ${variables.palette.on_surface_alfa12};
  }
  svg {
    fill: ${variables.palette.on_surface_variant};

    &.svg-scores-and-reports {
      margin-left: ${theme.spacing(0.6)};
    }
  }
  p {
    white-space: normal;
    margin-top: ${theme.spacing(1)};
  }

  ${({ isActive }: { isActive: boolean; isCompact: boolean }) =>
    isActive &&
    `
      background: ${variables.palette.secondary_container};

      &:hover {
        background: ${variables.palette.secondary_container};
      }
  `}

  ${({ isCompact }) =>
    isCompact &&
    `
    flex-direction: row;
    height: auto;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    padding: ${theme.spacing(1.2, 1.2, 1.2, 2.2)};
    border-radius: ${variables.borderRadius.xxxl};
    width: 27.4rem;
    margin-left: ${theme.spacing(1.6)};

    p {
      margin-top: 0;
    }
    svg {
      margin-right: ${theme.spacing(1.6)};

      &.svg-scores-and-reports {
        margin-right: ${theme.spacing(1)};
      }
    }
  `}
`;

export const StyledCol = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1)};
  margin-right: ${theme.spacing(2.8)};
  flex: 1 1 100%;
  min-width: 0;
`;

export const StyledTitle = styled(StyledLabelLarge, shouldForwardProp)`
  ${commonEllipsisStyles}

  ${({ isActive }: { isActive: boolean }) =>
    isActive &&
    `
      font-weight: ${variables.font.weight.bold};
      color: ${variables.palette.on_secondary_container};
  `}
`;
