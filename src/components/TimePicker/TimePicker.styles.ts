import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledTimePickerWrapper = styled(Box)`
  position: relative;

  .react-datepicker {
    border-radius: ${variables.borderRadius.lg};
  }

  .react-datepicker-popper[data-placement^='bottom'] {
    padding-top: ${theme.spacing(0.2)};
  }

  .react-datepicker-popper {
    z-index: 3;
    width: 100%;
  }

  .react-datepicker__header--time {
    display: none;
  }

  .react-datepicker-popper,
  .react-datepicker {
    inset: auto !important;
    transform: none !important;
  }

  .react-datepicker__time-container {
    float: none !important;
    width: auto !important;
  }

  .react-datepicker__time-container .react-datepicker__time {
    background: #e8f0f7;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    display: flex;
    align-items: center;
    justify-content: start;
    height: auto;
    padding: 10px 16px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #1a1c1e;
    border-radius: 4px;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    background-color: rgba(14, 29, 42, 0.08) !important;
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block !important;
  }

  .react-datepicker,
  .date-picker .react-datepicker-wrapper .react-datepicker__input-container input {
    width: 100% !important;
  }

  .react-datepicker,
  .react-datepicker__time-container .react-datepicker__time {
    border-radius: 12px !important;
    border: none !important;
  }

  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    width: auto !important;
    min-width: 120px;
    margin: 0 !important;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list {
    padding: 0 4px !important;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: #cee5ff !important;
    color: #1a1c1e !important;
    font-weight: 400 !important;
  }
`;
