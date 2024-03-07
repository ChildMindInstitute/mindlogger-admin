import { styled, Box } from '@mui/material';

import { theme, variables, StyledClearedButton } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

import { LEFT_SCHEDULE_PANEL_WIDTH } from '../Schedule.const';

const TIME_GUTTER_WIDTH = '8.5rem';

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

export const StyledCalendarWrapper = styled(Box, shouldForwardProp)`
  position: relative;
  width: calc(100% - ${LEFT_SCHEDULE_PANEL_WIDTH});

  &.day {
    .rbc-header {
      height: 0;
      border-bottom: 0;
    }

    .rbc-time-header-content {
      padding: ${({ hasMoreBtn }: { hasMoreBtn: boolean }) =>
        hasMoreBtn ? theme.spacing(1, 0.8, 2.1) : theme.spacing(1, 0.8)};
      border: none;
      position: relative;

      .rbc-row:empty {
        display: none;
      }
    }

    .rbc-day-slot {
      flex-shrink: 0;
      width: calc(100% - ${TIME_GUTTER_WIDTH});
    }
  }

  &.week {
    .rbc-time-header-content {
      border: none;
      position: relative;

      .rbc-row:empty {
        display: none;
      }
    }

    .rbc-header {
      border-color: ${variables.palette.surface_variant};
      z-index: ${theme.zIndex.fab};

      .rbc-button-link {
        text-align: right;
      }

      .date {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${theme.spacing(0, 0.95)};
        width: fit-content;
        min-width: 4rem;
        height: 4rem;
        margin-top: ${theme.spacing(0.4)};
        margin-left: auto;
        border-radius: ${variables.borderRadius.xxxl2};
      }

      &.rbc-today {
        background-color: transparent;

        .day-name {
          color: ${variables.palette.primary};
        }

        .date {
          color: ${variables.palette.white};
          background-color: ${variables.palette.primary};
        }
      }
    }

    .rbc-allday-cell {
      .rbc-row-content {
        padding: ${({ hasMoreBtn }: { hasMoreBtn: boolean }) =>
          hasMoreBtn ? theme.spacing(1.1, 0, 2.1) : theme.spacing(1.1, 0, 0.9)};
      }

      .rbc-event:not(.rbc-event-allday) {
        max-width: 96% !important;
      }
    }
  }

  // handle the corner case when the event ends at 00:00 on the next day
  .rbc-allday-cell {
    .rbc-event:not(.rbc-event-allday) {
      .event-bottom-section {
        display: none;
      }
    }
  }

  .not-hidden-event {
    .rbc-event {
      overflow: visible;
    }

    .more {
      pointer-events: none;
      z-index: ${theme.zIndex.fab};
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: calc(100% + 0.2rem);
      min-width: 100%;
      height: 1.6rem;
      padding: ${theme.spacing(0.2, 0.4)};
      font-size: ${variables.font.size.sm};
      font-weight: ${variables.font.weight.bold};
      line-height: ${variables.font.lineHeight.sm};
      letter-spacing: ${variables.font.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      border-radius: ${variables.borderRadius.xs};
      background-color: ${variables.palette.gray_alfa50};
    }
  }

  .hidden-event {
    display: none !important;
  }

  .rbc-events-container {
    .rbc-event {
      .event-alert-bottom {
        display: none;
      }

      .event-title-top {
        display: none;
      }
    }

    .h-sm {
      .rbc-event {
        .event-end-time,
        .event-bottom-section {
          display: none;
        }
      }
    }

    .w-lg,
    .w-md,
    .w-sm {
      .event {
        padding: ${theme.spacing(0.2)};
      }
    }

    .w-lg,
    .w-md {
      .rbc-event {
        .event-end-time {
          display: none;
        }
      }

      &:not(.h-sm) {
        .rbc-event {
          .event-flow-top {
            display: none;
          }
        }
      }

      &.h-sm {
        .rbc-event {
          .event-start-time {
            display: none;
          }
        }
      }
    }

    .w-xl {
      &:not(.h-sm) {
        .rbc-event {
          .event-flow-top {
            display: none;
          }
        }
      }

      &.h-sm {
        .rbc-event {
          .event-title-top {
            display: block;
          }

          .event-bottom-section {
            display: none;
          }
        }
      }
    }

    .w-lg {
      &.h-sm {
        .rbc-event {
          .event-title-top {
            display: block;
          }

          .event-bottom-section {
            display: none;
          }
        }
      }
    }

    .w-md {
      .rbc-event {
        .event-title-bottom,
        .event-end-time {
          display: none;
        }

        .event-alert-bottom {
          display: block;
        }

        .event-alert-top {
          display: none;
        }
      }

      &.h-sm {
        .rbc-event {
          .event-top-section {
            display: none;
          }

          .event-bottom-section {
            display: flex;
          }
        }
      }
    }

    .w-sm {
      .rbc-event {
        .rbc-event-label,
        .rbc-event-content {
          display: none;
        }
      }
    }
  }

  .rbc-time-content {
    .rbc-events-container {
      margin: ${theme.spacing(0, 0.8)};
      border-left: none;
    }
  }

  .rbc-current-time-indicator {
    display: none;
  }

  .rbc-time-view {
    border-width: ${variables.borderWidth.md} 0 0;
    border-color: ${variables.palette.surface_variant};

    .rbc-event {
      &:focus {
        outline: none;
      }
    }
  }

  .rbc-time-header {
    border: none;

    .rbc-header .rbc-button-link {
      pointer-events: none;
      width: 100%;
    }
  }

  .rbc-time-header-cell-single-day {
    display: block;
  }

  .rbc-time-content {
    padding-top: ${theme.spacing(1)};
    border-top: ${variables.borderWidth.xl} solid ${variables.palette.surface_variant};
  }

  .rbc-time-column:first-of-type {
    position: relative;
    z-index: ${theme.zIndex.fab};

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: -0.1rem;
      width: ${variables.borderWidth.md};
      height: 100%;
      border-right: ${variables.borderWidth.md} solid ${variables.palette.surface};
    }
  }

  .rbc-time-gutter {
    width: ${TIME_GUTTER_WIDTH};

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
        line-height: ${variables.font.lineHeight.md};
        letter-spacing: ${variables.font.letterSpacing.sm};
      }
    }
  }

  .rbc-time-header-gutter {
    padding: ${theme.spacing(1, 0.8)};
  }

  .rbc-timeslot-group {
    min-height: 7.6rem;
  }

  .rbc-day-slot {
    .rbc-timeslot-group {
      border-color: ${variables.palette.surface_variant};
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

  .rbc-row-segment {
    padding-bottom: ${theme.spacing(0.2)};

    &.hidden {
      padding: 0;
    }
  }

  .rbc-event {
    .rbc-event-label {
      display: none;
    }
  }

  .rbc-time-view {
    .rbc-row {
      min-height: unset;
    }

    .rbc-day-bg.rbc-today {
      background-color: unset;
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
      line-height: ${variables.font.lineHeight.sm};
      letter-spacing: ${variables.font.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      border-color: ${variables.palette.surface_variant};
      border-bottom: unset;
    }

    .rbc-event {
      &:focus {
        outline: none;
      }
    }

    .rbc-row-segment {
      padding: ${theme.spacing(0, 0, 0.18, 0)};
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
        min-width: 2.5rem;
        height: 2.5rem;
        font-family: 'Atkinson', helvetica, arial, sans-serif;
        font-size: ${variables.font.size.md};
        line-height: ${variables.font.lineHeight.md};
        letter-spacing: ${variables.font.letterSpacing.lg};
        color: ${variables.palette.on_surface_variant};
        transition: ${variables.transitions.opacity};
        padding: ${theme.spacing(0, 0.5)};

        &:hover {
          opacity: 0.8;
        }
      }

      &.rbc-now {
        .rbc-button-link:not(.rbc-show-more) {
          background-color: ${variables.palette.primary};
          color: ${variables.palette.white};
          border-radius: ${variables.borderRadius.xxxl2};
        }
      }
    }

    .rbc-show-more {
      margin: ${theme.spacing(0.2, 0, 0, 0.9)};
      font-size: ${variables.font.size.sm};
      line-height: ${variables.font.lineHeight.sm};
      letter-spacing: ${variables.font.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      transition: ${variables.transitions.opacity};

      &:hover {
        opacity: 0.8;
      }
    }

    .rbc-off-range {
      opacity: ${variables.opacity.disabled};
    }

    .rbc-off-range-bg {
      background: transparent;
    }
  }
`;
