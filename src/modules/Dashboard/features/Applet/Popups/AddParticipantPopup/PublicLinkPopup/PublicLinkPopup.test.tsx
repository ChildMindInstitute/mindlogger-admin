import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { PublicLinkPopup } from './PublicLinkPopup';

const mockedAxios = axios.create();
const fakeRequest = jest.fn();

const testId = 'public-link-popup';
const commonProps = {
  open: true,
  appletId: 'test-applet-id',
  'data-testid': testId,
  onClose: jest.fn(),
};

describe('PublicLinkPopup', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('When `hasPublicLink` is `true`', () => {
    beforeEach(() => {
      renderWithProviders(<PublicLinkPopup {...commonProps} hasPublicLink />);

      jest.spyOn(mockedAxios, 'delete').mockImplementation(fakeRequest);
      fakeRequest.mockReturnValue(new Promise((res) => res(null)));
    });

    test('It renders in the correct state', async () => {
      expect(screen.queryByTestId(`${testId}-delete-btn`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-no-account-btn`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-account-btn`)).not.toBeInTheDocument();
    });

    test('Calls the deletePublicLink endpoint', async () => {
      const deleteBtn = screen.getByTestId(`${testId}-delete-btn`);

      await userEvent.click(deleteBtn);

      expect(fakeRequest).toBeCalledWith(`/applets/${commonProps.appletId}/access_link`, {
        signal: undefined,
      });
    });
  });

  describe('When `hasPublicLink` is `false`', () => {
    beforeEach(() => {
      renderWithProviders(<PublicLinkPopup {...commonProps} />);

      jest.spyOn(mockedAxios, 'post').mockImplementation(fakeRequest);
      fakeRequest.mockReturnValue(new Promise((res) => res(null)));
    });

    test('It renders in the correct state', async () => {
      expect(screen.queryByTestId(`${testId}-delete-btn`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-no-account-btn`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-account-btn`)).toBeInTheDocument();
    });

    describe('When pressing the "account required" button', () => {
      test('Calls the deletePublicLink endpoint', async () => {
        const createBtn = screen.getByTestId(`${testId}-account-btn`);

        await userEvent.click(createBtn);

        expect(fakeRequest).toBeCalledWith(
          `/applets/${commonProps.appletId}/access_link`,
          { requireLogin: true },
          { signal: undefined },
        );
      });
    });

    describe('When pressing the "no account required" button', () => {
      test('Calls the deletePublicLink endpoint', async () => {
        const createBtn = screen.getByTestId(`${testId}-no-account-btn`);

        await userEvent.click(createBtn);

        expect(fakeRequest).toBeCalledWith(
          `/applets/${commonProps.appletId}/access_link`,
          { requireLogin: false },
          { signal: undefined },
        );
      });
    });
  });
});
