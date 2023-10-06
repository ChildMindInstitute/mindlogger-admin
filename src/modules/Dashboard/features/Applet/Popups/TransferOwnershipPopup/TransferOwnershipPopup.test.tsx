import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedEmail } from 'shared/mock';

import { TransferOwnershipPopup } from '.';

const preloadedState = {
  popups: {
    data: {
      applet: mockedApplet,
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: false,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: true,
      publishConcealPopupVisible: false,
    },
  },
};

describe('TransferOwnershipPopup component tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('TransferOwnershipPopup should appear success text', async () => {
    mockAxios.post.mockResolvedValueOnce(null);

    renderWithProviders(<TransferOwnershipPopup />, {
      preloadedState,
    });

    fireEvent.change(screen.getByLabelText(/Owner email/), {
      target: { value: mockedEmail },
    });
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      const el = screen.getByText('Your request has been successfully sent to', { exact: false });
      expect(el.textContent).toEqual(
        `Your request has been successfully sent to ${mockedEmail}. Please wait for receiver to accept your request.`,
      );
    });
  });
});
