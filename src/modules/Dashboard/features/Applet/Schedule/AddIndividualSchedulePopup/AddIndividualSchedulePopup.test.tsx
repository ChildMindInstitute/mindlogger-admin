import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AddIndividualSchedulePopup } from './AddIndividualSchedulePopup';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();
const dataTestid = 'add-individual-schedule-popup';

const basicProps = {
  open: true,
  onClose: onCloseMock,
  onSubmit: onSubmitMock,
  'data-testid': dataTestid,
  respondentName: 'John Doe',
  error: null,
  isLoading: false,
};

describe('AddIndividualSchedulePopup', () => {
  test('should render', () => {
    renderWithProviders(<AddIndividualSchedulePopup {...basicProps} />);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  test('should show spinner', () => {
    renderWithProviders(<AddIndividualSchedulePopup {...basicProps} isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('should show error', () => {
    const error = 'Something is wrong';
    renderWithProviders(<AddIndividualSchedulePopup {...basicProps} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  test('should call onSubmit and onClose', () => {
    renderWithProviders(<AddIndividualSchedulePopup {...basicProps} />);

    fireEvent.click(screen.getByText('Confirm'));
    expect(onSubmitMock).toBeCalled();

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toBeCalled();
  });
});
