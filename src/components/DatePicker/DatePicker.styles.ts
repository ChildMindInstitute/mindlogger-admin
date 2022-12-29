import { Box, Button, Popover, TextField } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledPopover = styled(Popover)`
  margin-top: ${theme.spacing(0.4)};

  .MuiPaper-root {
    background-color: ${variables.palette.surface2};
    box-shadow: ${variables.boxShadow.light2};
    display: flex;
    flex-direction: column;
  }

  .react-datepicker {
    width: 33.6rem;
    font-size: ${variables.font.size.sm};
    line-height: ${variables.lineHeight.sm};
    letter-spacing: ${variables.letterSpacing.xl};
    font-family: 'NotoSans', helvetica, arial, sans-serif;
    background-color: transparent;
    border: none;
    border-radius: unset;

    &__header {
      background-color: transparent;
      border-bottom: none;
      padding: 0;
    }

    &__week,
    &__day-names {
      display: flex;
      justify-content: space-between;
    }

    &__day-names {
      padding-bottom: ${theme.spacing(1.4)};
      margin: ${theme.spacing(0, 2.2)};
    }

    &__day {
      width: 4rem;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: ${variables.borderRadius.half};
      transition: ${variables.transitions.bgColor};

      &:hover {
        background-color: ${variables.palette.on_surface_alfa8};
      }
    }

    &__day--selected {
      background-color: ${variables.palette.primary};

      &:hover {
        background-color: ${variables.palette.primary};
      }
    }

    &__month-container {
      width: 100%;
    }

    &__month {
      margin: ${theme.spacing(0, 1.1)};
    }

    &__current-month {
      display: none;
    }
  }
`;

export const StyledTextField = styled(TextField)`
  min-width: 20rem;

  .MuiInputBase-root {
    padding-right: ${theme.spacing(0.5)};
  }

  input.Mui-disabled {
    color: ${variables.palette.black};
    -webkit-text-fill-color: ${variables.palette.black};
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

  &:hover,
  &:active,
  &:focus {
    svg {
      fill: ${variables.palette.primary};
    }
  }
`;

export const StyledButtons = styled(Box)`
  padding: ${theme.spacing(0.2, 1.1, 1.6)};
  margin-left: ${theme.spacing(0.5)};
  text-align: right;
`;

export const StyledButton = styled(Button)`
  margin-left: ${theme.spacing(0.5)};
`;

export const StyledCollapseBtn = styled(StyledClearedButton)`
  &.MuiButton-text {
    width: 33.6rem;
    justify-content: flex-start;
    margin: ${theme.spacing(0.8, 0.4, 0)};
    padding: ${theme.spacing(1.6)};
    border-radius: ${variables.borderRadius.xxs};

    &:hover,
    &:focus,
    &:active {
      background-color: ${variables.palette.surface_variant};
    }
  }
`;
