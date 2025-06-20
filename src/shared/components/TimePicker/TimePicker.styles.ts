import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTimePickerWrapper = styled(Box)`
  position: relative;
  width: ${({ width }: { width?: number | undefined }) => (width ? `${width}rem` : '100%')};

  .MuiTextField-root {
    width: 100%;
  }

  .react-datepicker-wrapper {
    display: block;
  }

  .react-datepicker-popper[data-placement^='bottom'] {
    padding-top: ${theme.spacing(0.2)};
  }

  .react-datepicker-popper {
    z-index: ${theme.zIndex.appBar};
    width: 100%;
  }

  .react-datepicker-popper,
  .react-datepicker {
    inset: auto;
    transform: none;
  }

  .react-datepicker {
    border-radius: ${variables.borderRadius.lg};
  }

  .react-datepicker__header--time {
    display: none;
  }

  .react-datepicker__time-container {
    float: none;
    width: auto;

    .react-datepicker__time {
      background: ${variables.palette.surface2};
      box-shadow: ${variables.boxShadow.light2};

      .react-datepicker__time-box {
        width: auto;
        min-width: 12rem;
        margin: 0;
        padding: ${theme.spacing(0.8, 0.2, 0.8, 0)};
      }

      .react-datepicker__time-box ul.react-datepicker__time-list {
        padding: ${theme.spacing(0, 0.2, 0, 0.4)};
        box-sizing: border-box;
        overflow-y: auto;

        li {
          &.react-datepicker__time-list-item {
            display: flex;
            align-items: center;
            justify-content: start;
            height: auto;
            padding: ${theme.spacing(1, 1.6)};
            font-family: 'Moderat', helvetica, arial, sans-serif;
            font-weight: ${variables.font.weight.regular};
            font-size: ${variables.font.size.body2};
            line-height: ${variables.font.lineHeight.body2};
            color: ${variables.palette.on_surface};
            border-radius: ${variables.borderRadius.xs};

            &:hover {
              background-color: ${variables.palette.on_secondary_container_alpha8};
            }

            &.react-datepicker__time-list-item--disabled {
              display: none;
            }
          }

          &.react-datepicker__time-list-item--selected {
            background-color: ${variables.palette.primary_container};
            color: ${variables.palette.on_surface};
            font-weight: ${variables.font.weight.regular};
          }
        }
      }
    }
  }

  .react-datepicker,
  .date-picker .react-datepicker-wrapper .react-datepicker__input-container input {
    width: 100%;
  }

  .react-datepicker,
  .react-datepicker__time-container .react-datepicker__time {
    border-radius: ${variables.borderRadius.lg};
    border: none;
  }
`;

export const StyledIcon = styled(Box)`
  display: flex;
  margin-left: ${theme.spacing(1)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
