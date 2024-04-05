import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import { AddParticipantForm } from './AddParticipantForm';
import { AccountType, AddParticipantFormValues } from '../AddParticipantPopup.types';
import { AddParticipantFormProps } from './AddParticipantForm.types';

const mockOnSubmit = jest.fn();
const dataTestid = 'test-id';

const AddParticipantFormTest = ({ accountType }: Pick<AddParticipantFormProps, 'accountType'>) => {
  const { control } = useForm<AddParticipantFormValues>();

  return (
    <AddParticipantForm
      onSubmit={mockOnSubmit}
      accountType={accountType}
      control={control}
      data-testid={dataTestid}
    />
  );
};

const limitedAccountLabelNames = ['ID', 'First Name', 'Last Name', 'Nickname'];
const onlyFullAccountLabelNames = ['Email', 'Invitation Language'];
const fullAccountLabelNames = [...limitedAccountLabelNames, ...onlyFullAccountLabelNames];

describe('AddParticipantForm component tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('The form has fields according to the account type', () => {
    const { rerender } = render(<AddParticipantFormTest accountType={AccountType.Full} />);

    fullAccountLabelNames.forEach((label) =>
      expect(screen.getByLabelText(label)).toBeInTheDocument(),
    );

    rerender(<AddParticipantFormTest accountType={AccountType.Limited} />);

    limitedAccountLabelNames.forEach((label) =>
      expect(screen.getByLabelText(label)).toBeInTheDocument(),
    );
    onlyFullAccountLabelNames.forEach((label) =>
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
    );
  });

  test('The onSubmit handler is called when the form is submitted', () => {
    const { getByTestId } = render(<AddParticipantFormTest accountType={AccountType.Full} />);

    const form = getByTestId(`${dataTestid}-form`);
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
