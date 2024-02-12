import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { mockedApplet, mockedEmail } from 'shared/mock';
import { expectBanner, renderWithProviders } from 'shared/utils';

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

    const { store } = renderWithProviders(<TransferOwnershipPopup />, {
      preloadedState,
    });

    fireEvent.change(screen.getByLabelText(/Owner email/), {
      target: { value: mockedEmail },
    });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expectBanner(store, 'dashboard-applets-transfer-success-banner');
    });
  });
});
