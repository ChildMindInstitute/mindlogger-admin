import { styled, Box, Button, Popover, TextField } from '@mui/material';

import { variables, StyledClearedButton, theme } from 'shared/styles';

export const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface2};
    box-shadow: ${variables.boxShadow.light2};
    border-radius: ${variables.borderRadius.xxl};
  }

  .react-datepicker {
    font-size: ${variables.font.size.md};
    line-height: ${variables.font.lineHeight.md};
    letter-spacing: ${variables.font.letterSpacing.lg};
    font-family: 'Atkinson', helvetica, arial, sans-serif;
    background-color: transparent;
    border: none;
    border-radius: unset;
    padding: ${theme.spacing(0, 1.2)};

    &__header {
      background-color: transparent;
      border-bottom: none;
      padding: 0;
    }

    &__day {
      width: 4rem;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: ${variables.borderRadius.half};
      margin: ${theme.spacing(0.4, 0)};

      &:hover {
        background-color: ${variables.palette.on_surface_alfa8};
      }
    }

    &__day--keyboard-selected:not(.react-datepicker__day--disabled):not(
        .react-datepicker__day--outside-month
      ) {
      color: ${variables.palette.on_surface};
    }

    &__day--keyboard-selected {
      background-color: transparent;
    }

    &__day--in-selecting-range,
    &__day--in-range {
      position: relative;
      background-color: ${variables.palette.secondary_container};
      border-radius: unset;
      color: ${variables.palette.on_surface_variant};
    }

    &__day--selected,
    &__day--range-end,
    &__day--range-start {
      border-radius: ${variables.borderRadius.half};
      background-color: ${variables.palette.primary};
      font-weight: ${variables.font.weight.bold};
      color: ${variables.palette.white};
      z-index: ${theme.zIndex.fab};
      transform-style: preserve-3d;

      &:hover {
        background-color: ${variables.palette.primary};
      }
    }

    &__day--today:not(.react-datepicker__day--selected):not(
        .react-datepicker__day--outside-month
      ):not(.react-datepicker__day--disabled) {
      border: ${variables.borderWidth.md} solid ${variables.palette.primary};
      font-weight: ${variables.font.weight.regular};
      color: ${variables.palette.primary};
    }

    &__day--today.react-datepicker__day--disabled:not(.react-datepicker__day--outside-month) {
      border: ${variables.borderWidth.md} solid ${variables.palette.on_surface_alfa12};
      font-weight: ${variables.font.weight.regular};
    }

    &__day--outside-month {
      background-color: transparent;
      color: transparent;
      pointer-events: none;

      &:hover {
        background-color: transparent;
      }
    }

    &__day-name {
      width: 4rem;
      margin: 0;
      color: ${variables.palette.outline};
    }

    &__week,
    &__day-names {
      display: flex;
    }

    &__day-names {
      margin-bottom: ${theme.spacing(1)};
    }

    &__month {
      margin: 0;
    }
  }

  .react-datepicker__month-container + .react-datepicker__month-container {
    border-left: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  }

  .react-datepicker__day--range-start + .react-datepicker__day--in-range:not(:empty):before,
  .react-datepicker__day--in-range:not(:empty)
    + .react-datepicker__day--range-end:not(:empty):before {
    position: absolute;
    content: '';
    top: 0;
    width: 50%;
    height: 100%;
    background-color: ${variables.palette.secondary_container};
  }

  .react-datepicker__day--range-start + .react-datepicker__day--in-range:before {
    left: -50%;
  }

  .react-datepicker__day--in-range:not(:empty)
    + .react-datepicker__day--range-end:not(:empty):before {
    left: 0;
    transform: translateZ(-0.1rem);
  }
`;

export const StyledTextField = styled(TextField)`
  min-width: 20rem;

  .MuiInputBase-root {
    padding-right: ${theme.spacing(0.5)};
  }

  .MuiInputBase-input {
    caret-color: transparent;
  }

  .Mui-disabled {
    -webkit-text-fill-color: ${variables.palette.on_surface_alfa38};

    .MuiOutlinedInput-notchedOutline {
      border-color: ${variables.palette.on_surface_alfa12};
    }
  }

  .MuiOutlinedInput-notchedOutline {
    transition: ${variables.transitions.border};
  }

  &.active {
    label {
      color: ${variables.palette.primary};
    }

    .MuiInputBase-root {
      svg {
        fill: ${variables.palette.primary};
      }

      .MuiOutlinedInput-notchedOutline {
        border-width: ${variables.borderWidth.lg};
        border-color: ${variables.palette.primary};
      }
    }
  }
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  padding: ${theme.spacing(1)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:disabled {
    svg {
      opacity: ${variables.opacity.disabled};
    }
  }

  &:hover:not([disabled]),
  &:active:not([disabled]),
  &:focus:not([disabled]) {
    svg {
      fill: ${variables.palette.primary};
    }
  }
`;

export const StyledButtons = styled(Box)`
  padding: ${theme.spacing(0.2, 1.2, 1.6)};
  text-align: right;
`;

export const StyledButton = styled(Button)`
  text-transform: uppercase;
  font-weight: ${variables.font.weight.bold};
  min-width: 10rem;
`;

export const StyledCancelButton = styled(StyledButton)`
  font-weight: ${variables.font.weight.regular};
  text-transform: none;
  margin-right: ${theme.spacing(0.7)};
`;

export const DatePickerFallback = styled(Box)`
  min-height: 30rem;
  min-width: 30rem;
`;
