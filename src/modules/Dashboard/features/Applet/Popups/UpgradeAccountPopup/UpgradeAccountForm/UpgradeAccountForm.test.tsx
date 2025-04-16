import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import { ApiLanguages } from 'api';

import { UpgradeAccountForm } from './UpgradeAccountForm';
import { UpgradeAccountFormValues } from '../UpgradeAccountPopup.types';

const mockOnSubmit = vi.fn();
const dataTestid = 'test-id';

const UpgradeAccountFormTest = () => {
  const { control } = useForm<UpgradeAccountFormValues>({
    defaultValues: {
      email: '',
      language: ApiLanguages.EN,
    },
  });

  return <UpgradeAccountForm onSubmit={mockOnSubmit} control={control} data-testid={dataTestid} />;
};

const labelNames = ['Email Address', 'Invitation Language'];

describe('AddParticipantForm component tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('The form has all fields', () => {
    render(<UpgradeAccountFormTest />);

    labelNames.forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
  });

  test('The onSubmit handler is called when the form is submitted', () => {
    const { getByTestId } = render(<UpgradeAccountFormTest />);

    const form = getByTestId(`${dataTestid}-form`);
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
