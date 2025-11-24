import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ValidationMode, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { InputController } from './InputController';
import { InputControllerProps } from './InputController.types';

type FormValues = {
  testInput: string;
};

type InputControllerTestProps = {
  mode?: keyof ValidationMode;
} & Partial<InputControllerProps<FormValues>>;

const errorMsg = 'testInput invalid';

const defaultProps = {
  label: 'test label',
  isErrorVisible: true,
  helperText: 'helper text',
};

const InputControllerTest = ({ mode, ...props }: InputControllerTestProps) => {
  const { control } = useForm<FormValues>({
    resolver: yupResolver(
      yup.object({
        testInput: yup.string().required(errorMsg),
      }),
    ),
    mode,
  });

  return (
    <form>
      <InputController control={control} name="testInput" {...defaultProps} {...props} />
    </form>
  );
};

describe('InputController component', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should render component', () => {
    const { getByRole, rerender } = render(<InputControllerTest />);
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(screen.getAllByText(defaultProps.label)[0]).toBeInTheDocument();
    expect(screen.getAllByText(defaultProps.helperText)[0]).toBeInTheDocument();

    rerender(<InputControllerTest isErrorVisible={false} />);
    expect(screen.queryByText(defaultProps.helperText)).toBeFalsy();
  });

  test('should render error message when validation fails on change', async () => {
    const { getByRole } = render(<InputControllerTest mode="onChange" />);
    const input = getByRole('textbox');

    expect(screen.queryByText(errorMsg)).toBeFalsy();
    fireEvent.input(input, { target: { value: 'some value' } });
    await waitFor(() => {
      expect(screen.queryByText(errorMsg)).toBeFalsy();
    });
    fireEvent.input(input, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByText(errorMsg)).toBeInTheDocument();
    });
  });

  test('should render error message when validation fails on blur', async () => {
    const { getByRole } = render(<InputControllerTest mode="onBlur" />);
    const input = getByRole('textbox');

    expect(screen.queryByText(errorMsg)).toBeFalsy();
    fireEvent.input(input, { target: { value: 'some value' } });
    await waitFor(() => {
      expect(screen.queryByText(errorMsg)).toBeFalsy();
    });
    fireEvent.input(input, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByText(errorMsg)).toBeFalsy();
    });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.queryByText(errorMsg)).toBeInTheDocument();
    });
  });
});
