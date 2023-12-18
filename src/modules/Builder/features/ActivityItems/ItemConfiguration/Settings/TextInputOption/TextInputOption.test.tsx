import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render } from '@testing-library/react';

import { TextInputOption } from './TextInputOption';

const onRemove = jest.fn();

const TextInputOptionComponent = ({ required = false }: { required?: boolean }) => {
  const methods = useForm({
    defaultValues: {
      item: {
        config: {
          additionalResponseOption: {
            textInputRequired: required,
          },
        },
      },
    },
  });

  return (
    <FormProvider {...methods}>
      <TextInputOption name={'item'} onRemove={onRemove} />
    </FormProvider>
  );
};

describe('TextInputOption', () => {
  test('renders component for when textInputRequired is true and calls onRemove callback when remove button is clicked', () => {
    const { getByText, getByTestId } = render(<TextInputOptionComponent required />);

    expect(getByText('Additional Text Input Option (Required)')).toBeInTheDocument();
    expect(
      getByText('The respondent will be required to enter an additional text response'),
    ).toBeInTheDocument();
    expect(getByText('*Required')).toBeInTheDocument();

    fireEvent.click(
      getByTestId('builder-activity-items-item-configuration-text-input-option-remove'),
    );

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('renders component for when textInputRequired is false', () => {
    const { getByText, queryByText } = render(<TextInputOptionComponent />);

    expect(getByText('Additional Text Input Option')).toBeInTheDocument();
    expect(
      getByText('The respondent will be able to enter an additional text response'),
    ).toBeInTheDocument();
    expect(queryByText('*Required')).toBeNull();
  });
});
