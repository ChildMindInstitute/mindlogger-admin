import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';

import { PublishConcealAppletPopup } from '.';

const getPreloadedState = (isPublished: boolean) => ({
  applet: {
    applet: {
      ...initialStateData,
      data: {
        result: {
          ...mockedApplet,
          isPublished,
        },
      },
    },
  },
  popups: {
    data: {
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: false,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: false,
      publishConcealPopupVisible: true,
    },
  },
});

describe('PublishConcealAppletPopup', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('PublishConcealAppletPopup should open success concealed modal', async () => {
    mockAxios.post.mockResolvedValueOnce(null);

    renderWithProviders(<PublishConcealAppletPopup />, {
      preloadedState: getPreloadedState(true),
    });

    fireEvent.click(screen.getByText('Yes'));
    await waitFor(() => expect(screen.getByText(/concealed/)).toBeInTheDocument());
  });

  test('PublishConcealAppletPopup should open success published modal', async () => {
    mockAxios.post.mockResolvedValueOnce(null);

    renderWithProviders(<PublishConcealAppletPopup />, {
      preloadedState: getPreloadedState(false),
    });

    fireEvent.click(screen.getByText('Yes'));
    await waitFor(() => expect(screen.getByText(/published/)).toBeInTheDocument());
  });
});
