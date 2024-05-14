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
      expect(screen.queryByTestId(`${testId}-delete-bttn`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-no-account-bttn`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-account-bttn`)).not.toBeInTheDocument();
    });

    test('Calls the deletePublicLink endpoint', async () => {
      const deleteBttn = screen.getByTestId(`${testId}-delete-bttn`);

      await userEvent.click(deleteBttn);

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
      expect(screen.queryByTestId(`${testId}-delete-bttn`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-no-account-bttn`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-account-bttn`)).toBeInTheDocument();
    });

    describe('When pressing the "account required" button', () => {
      test('Calls the deletePublicLink endpoint', async () => {
        const createBttn = screen.getByTestId(`${testId}-account-bttn`);

        await userEvent.click(createBttn);

        expect(fakeRequest).toBeCalledWith(
          `/applets/${commonProps.appletId}/access_link`,
          { requireLogin: true },
          { signal: undefined },
        );
      });
    });

    describe('When pressing the "no account required" button', () => {
      test('Calls the deletePublicLink endpoint', async () => {
        const createBttn = screen.getByTestId(`${testId}-no-account-bttn`);

        await userEvent.click(createBttn);

        expect(fakeRequest).toBeCalledWith(
          `/applets/${commonProps.appletId}/access_link`,
          { requireLogin: false },
          { signal: undefined },
        );
      });
    });
  });
});
