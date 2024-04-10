import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

import { renderWithProviders } from 'shared/utils';

import { FeedbackNotesFormProps } from './FeedbackNotesForm.types';
import { FeedbackNotesForm } from './FeedbackNotesForm';

const dataTestId = 'feedback-notes-form';
const mockOnSubmit = jest.fn();
const FormWrapper = (props?: Partial<FeedbackNotesFormProps>) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FeedbackNotesForm
        containerRef={{ current: null }}
        onSubmit={mockOnSubmit}
        isLoading={false}
        data-testid={dataTestId}
        {...props}
      />
    </FormProvider>
  );
};
const renderComponent = (props?: Partial<FeedbackNotesFormProps>) =>
  renderWithProviders(<FormWrapper {...props} />);

describe('FeedbackNotesForm', () => {
  test('should render and submit', async () => {
    const { container } = renderComponent();

    expect(container).toBeTruthy();
    expect(screen.getByTestId(`${dataTestId}-add-note`)).toBeInTheDocument();

    const saveButton = screen.getByTestId(`${dataTestId}-save`);
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(saveButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('should disable save button and input when isLoading is true', () => {
    renderComponent({ isLoading: true });

    expect(screen.getByTestId(`${dataTestId}-save`)).toBeDisabled();
    expect(
      screen.getByTestId(`${dataTestId}-add-note`).querySelector('.MuiInputBase-input'),
    ).toBeDisabled();
  });
});
