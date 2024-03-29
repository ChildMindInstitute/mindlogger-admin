import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { mockedAppletId, mockedEmail } from 'shared/mock';

import { TransferOwnership } from './TransferOwnership';

const mockedSetIsSubmitted = jest.fn();
const mockedSetEmailTransferred = jest.fn();
const dataTestid = 'transfer-ownership';

const transferOwnershipComponent = (
  <TransferOwnership
    appletId={mockedAppletId}
    setIsSubmitted={mockedSetIsSubmitted}
    setEmailTransferred={mockedSetEmailTransferred}
    isSubmitted={false}
    data-testid={dataTestid}
  />
);

describe('TransferOwnership', () => {
  test('renders without errors', () => {
    render(transferOwnershipComponent);
  });

  test('not transfers ownership on form submission with invalid email', async () => {
    render(transferOwnershipComponent);
    await userEvent.type(screen.getByLabelText(/Email/i), 'invalid@email{enter}');

    const error = await screen.findByText('Email must be valid');
    expect(error).toBeInTheDocument();
  });

  test('transfers ownership on form submission with valid email', async () => {
    render(transferOwnershipComponent);
    await userEvent.type(screen.getByLabelText(/Email/i), `${mockedEmail}{enter}`);

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
