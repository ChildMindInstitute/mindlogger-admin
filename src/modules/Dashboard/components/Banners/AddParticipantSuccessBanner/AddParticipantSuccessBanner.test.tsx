import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';

import { AddParticipantSuccessBanner } from './AddParticipantSuccessBanner';

const mockOnClose = vi.fn();
const dataTestid = 'success-banner';
const props = {
  accountType: AccountType.Full,
  id: 'test-id',
  onClose: mockOnClose,
  'data-testid': dataTestid,
};
const mockedUseNavigate = vi.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('AddParticipantSuccessBanner', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render', () => {
    const { getByTestId, getByText, rerender } = renderWithProviders(
      <AddParticipantSuccessBanner {...props} />,
    );

    expect(getByTestId(dataTestid)).toBeInTheDocument();
    expect(getByText(props.id)).toBeInTheDocument();
    expect(getByText('Sent invitation to')).toBeInTheDocument();

    rerender(<AddParticipantSuccessBanner {...props} accountType={AccountType.Limited} />);
    expect(getByTestId(dataTestid)).toBeInTheDocument();
    expect(getByText(props.id)).toBeInTheDocument();
    expect(getByText('Created limited account for')).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    const { getByTitle } = renderWithProviders(<AddParticipantSuccessBanner {...props} />);

    const closeButton = getByTitle('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
