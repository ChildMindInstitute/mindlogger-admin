import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledAddBtn = styled(StyledClearedButton)`
  z-index: ${theme.zIndex.fab};
  position: absolute;
  bottom: 2.2rem;
  right: 3.2rem;
  width: 4rem;
  height: 4rem;
  border-radius: ${variables.borderRadius.lg};
  background-color: ${variables.palette.surface3};
  box-shadow: ${variables.boxShadow.light2};

  svg {
    fill: ${variables.palette.primary};
  }

  &.MuiButton-text:hover {
    background-color: ${variables.palette.surface};
  }
`;

export const StyledTimeHeaderGutter = styled(StyledFlexTopCenter)`
  svg {
    flex-shrink: 0;
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledCalendarWrapper = styled(Box)`
  position: relative;
  flex-grow: 1;

  .rbc-current-time-indicator {
    display: none;
  }

  .rbc-time-view {
    border-width: ${variables.borderWidth.md} 0 0;
    border-color: ${variables.palette.surface_variant};
  }

  .rbc-time-header-content {
    padding: ${theme.spacing(1, 0.8)};
    border: none;
  }

  .rbc-time-content {
    padding-top: ${theme.spacing(1)};
    border-top: ${variables.borderWidth.xl} solid ${variables.palette.surface_variant};

    & > * + * > * {
      border-left: none;
    }
  }

  .rbc-time-gutter {
    width: 8.5rem;

    .rbc-timeslot-group {
      position: relative;
      border: none;
    }

    .rbc-time-slot {
      .rbc-label {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-50%);
        color: ${variables.palette.outline};
        font-size: ${variables.font.size.md};
        line-height: ${variables.lineHeight.md};
        letter-spacing: ${variables.letterSpacing.sm};
      }
    }
  }

  .rbc-time-header {
    margin-right: 0 !important;
  }

  .rbc-time-header-gutter {
    display: flex;
    align-items: center;
  }

  .rbc-time-header-content {
    .rbc-row:empty {
      display: none;
    }
  }

  .rbc-timeslot-group {
    min-height: 7.6rem;
  }

  .rbc-day-slot {
    .rbc-timeslot-group {
      border-left: none;
      border-bottom: none;
      border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
      min-height: 7.6rem;
    }

    &.rbc-today {
      background-color: transparent;
    }

    .rbc-time-slot {
      border: none;
    }
  }

  .rbc-month-view {
    border-left: unset;
    border-bottom: unset;
    border-color: ${variables.palette.surface_variant};

    .rbc-header {
      padding-top: ${theme.spacing(0.3)};
      text-transform: uppercase;
      font-size: ${variables.font.size.sm};
      line-height: ${variables.lineHeight.sm};
      letter-spacing: ${variables.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      border-color: ${variables.palette.surface_variant};
      border-bottom: unset;
    }

    .rbc-event {
      max-width: 92%;
      margin: 0 auto;
      transition: ${variables.transitions.opacity};

      &:hover {
        opacity: 0.9;
      }

      &:focus {
        outline-color: ${variables.palette.primary};
      }
    }

    .rbc-row-segment .rbc-event-content {
      white-space: unset;
    }

    .rbc-day-bg {
      border-color: ${variables.palette.surface_variant};

      &.rbc-today {
        background-color: transparent;
      }
    }

    .rbc-date-cell {
      padding: ${theme.spacing(0.25)};

      .rbc-button-link:not(.rbc-show-more) {
        width: 2.5rem;
        height: 2.5rem;
        font-family: 'Atkinson', helvetica, arial, sans-serif;
        font-size: ${variables.font.size.md};
        line-height: ${variables.lineHeight.md};
        letter-spacing: ${variables.letterSpacing.lg};
        color: ${variables.palette.on_surface_variant};
        transition: ${variables.transitions.opacity};

        &:hover {
          opacity: 0.8;
        }
      }

      &.rbc-now {
        .rbc-button-link:not(.rbc-show-more) {
          background-color: ${variables.palette.primary};
          color: ${variables.palette.white};
          border-radius: ${variables.borderRadius.half};
        }
      }
    }

    .rbc-show-more {
      margin: ${theme.spacing(0.3, 0, 0, 0.9)};
      font-size: ${variables.font.size.sm};
      line-height: ${variables.lineHeight.sm};
      letter-spacing: ${variables.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      transition: ${variables.transitions.opacity};

      &:hover {
        opacity: 0.8;
      }
    }

    .rbc-off-range {
      opacity: 0.38;
    }

    .rbc-off-range-bg {
      background: transparent;
    }
  }
`;
