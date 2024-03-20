import { render, screen } from '@testing-library/react';
import { FieldError } from 'react-hook-form';

import { DatePickerInput } from './DatePickerInput';

describe('DatePickerInput', () => {
  const mockedHandlePickerShow = jest.fn();
  const sharedProps = {
    inputSx: {},
    id: 'icon_id',
    handlePickerShow: mockedHandlePickerShow,
    dataTestid: 'testId',
    label: 'test_label',
    value: 'test_value',
  };

  test('should render without an error, enabled and inactive', () => {
    const textFieldProps = {
      ...sharedProps,
      disabled: false,
      isOpen: false,
    };
    render(<DatePickerInput {...textFieldProps} />);

    const input = screen.getByLabelText('test_label');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveClass('Mui-disabled');
    expect(input.parentElement).not.toHaveClass('Mui-disabled Mui-error');
    expect(screen.getByDisplayValue('test_value')).toBeInTheDocument();
    expect(screen.queryByText('errorMessage')).not.toBeInTheDocument();
    expect(screen.getByTestId('testId')).not.toHaveClass('active');
  });

  test('should render with an error, disabled and active', () => {
    const textFieldProps = {
      ...sharedProps,
      disabled: true,
      isOpen: true,
      error: { message: 'errorMessage' } as FieldError,
    };
    render(<DatePickerInput {...textFieldProps} />);

    const input = screen.getByLabelText('test_label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('Mui-disabled');
    expect(input.parentElement).toHaveClass('Mui-disabled Mui-error');
    expect(screen.getByDisplayValue('test_value')).toBeInTheDocument();
    expect(screen.getByText('errorMessage')).toBeInTheDocument();
    expect(screen.getByTestId('testId')).toHaveClass('active');
  });
});
