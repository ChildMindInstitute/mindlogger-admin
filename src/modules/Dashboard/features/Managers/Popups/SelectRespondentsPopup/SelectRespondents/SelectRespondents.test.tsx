import { FormProvider, useForm } from 'react-hook-form';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import { SelectRespondents } from './SelectRespondents';
import { SearchAcross } from './SelectRespondents.const';
import { SelectRespondentsProps } from './SelectRespondents.types';

const mockRespondents = [
  { id: '1', secretId: '123', nickname: 'John Doe' },
  { id: '2', secretId: '456', nickname: 'Jane Doe' },
];

const mockProps: SelectRespondentsProps = {
  reviewer: { name: 'Reviewer Name', email: 'reviewer@example.com' },
  appletName: 'Test Applet',
  respondents: mockRespondents,
};

const SelectRespondentsComponent = (props: SelectRespondentsProps) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <SelectRespondents {...props} />
    </FormProvider>
  );
};

describe('SelectRespondents', () => {
  test('renders the component with empty respondents', () => {
    render(<SelectRespondentsComponent {...mockProps} respondents={[]} />);

    expect(screen.getByText('Reviewer Name (reviewer@example.com)')).toBeInTheDocument();
    expect(screen.getByText(/No Respondents yet./)).toBeInTheDocument();
  });

  test('renders the component and handles search input', async () => {
    render(<SelectRespondentsComponent {...mockProps} />);

    const searchContainer = screen.getByTestId('dashboard-select-respondents-search');
    expect(searchContainer).toBeInTheDocument();

    const searchElement = searchContainer.querySelector('input') as HTMLElement;
    expect(searchElement).toBeInTheDocument();

    fireEvent.change(searchElement, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  test('renders the component and handles search across filter change', async () => {
    render(<SelectRespondentsComponent {...mockProps} />);

    const selectContainer = screen.getByTestId('select-respondents-popup-search-across');
    expect(selectContainer).toBeInTheDocument();

    const selectElement = selectContainer.querySelector('input') as HTMLElement;
    expect(selectElement).toBeInTheDocument();

    fireEvent.change(selectElement, { target: { value: SearchAcross.Selected } });

    await waitFor(() => {
      expect(screen.getByText(/No Data/)).toBeInTheDocument();
    });
  });

  test('renders the component with the correct description and handles respondent selection', async () => {
    render(<SelectRespondentsComponent {...mockProps} />);

    const respondent = screen.getByTestId('dashboard-managers-select-respondents-respondent-1');
    expect(respondent).toBeInTheDocument();

    fireEvent.click(respondent);

    const selectContainer = screen.getByTestId('select-respondents-popup-search-across');
    expect(selectContainer).toBeInTheDocument();

    const selectElement = selectContainer.querySelector('input') as HTMLElement;
    expect(selectElement).toBeInTheDocument();

    fireEvent.change(selectElement, { target: { value: SearchAcross.Selected } });

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText(/1 Respondent selected/)).toBeInTheDocument();
    });
  });
});
