import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { mockedAppletId, mockedEmail } from 'shared/mock';

import { TransferOwnership } from './TransferOwnership';

const mockedSetIsSubmitted = jest.fn();
const mockedSetEmailTransfered = jest.fn();
const dataTestid = 'transfer-ownership';

const transferOwnershipComponent = (
  <TransferOwnership
    appletId={mockedAppletId}
    setIsSubmitted={mockedSetIsSubmitted}
    setEmailTransfered={mockedSetEmailTransfered}
    isSubmitted={false}
    data-testid={dataTestid}
  />
);

describe('TransferOwnership', () => {
  test('renders without errors', () => {
    render(transferOwnershipComponent);
  });

  test('transfers ownership on form submission with invalid email', async () => {
    const { getByTestId } = render(transferOwnershipComponent);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid@email' } });
    fireEvent.submit(getByTestId(dataTestid));

    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());
  });

  test('transfers ownership on form submission with valid email', async () => {
    const { getByTestId } = render(transferOwnershipComponent);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: mockedEmail } });
    fireEvent.submit(getByTestId(dataTestid));

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/applets/${mockedAppletId}/transferOwnership`,
        { email: mockedEmail },
        { signal: undefined },
      );
    });
  });
});
