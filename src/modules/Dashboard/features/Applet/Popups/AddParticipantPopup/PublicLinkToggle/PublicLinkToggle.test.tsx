import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { PublicLinkToggle } from './PublicLinkToggle';

const mockedAxios = axios.create();
const fakeRequest = jest.fn();

const testId = 'public-link-toggle';
const commonProps = {
  'data-testid': testId,
  appletId: 'test-applet-id',
  onConfirmPublicLink: jest.fn(),
};
const testResponse = {
  data: {
    result: {
      link: 'test-url',
      requireLogin: true,
    },
  },
};

describe('PublicLinkToggle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(mockedAxios, 'get').mockImplementation(fakeRequest);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  describe('When no public link is returned', () => {
    beforeEach(() => {
      fakeRequest.mockReturnValue(new Promise((res) => res(null)));

      renderWithProviders(<PublicLinkToggle {...commonProps} />);
    });

    test('It renders in the correct state', async () => {
      jest.runAllTicks();

      await waitFor(() => {
        expect(fakeRequest).toBeCalledWith(`/applets/${commonProps.appletId}/access_link`, {
          signal: undefined,
        });

        const createBtn = screen.getByTestId(`${testId}-confirm-btn`);

        expect(createBtn).toBeInTheDocument();
        expect(createBtn.textContent).toBe('Create Public Link');
        expect(screen.queryByTestId(`${testId}-confirm-btn`)).toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-input`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-copy-btn`)).not.toBeInTheDocument();
      });
    });

    test('It calls `onConfirmPublicLink` with the appropriate parameter', async () => {
      jest.runAllTicks();

      await waitFor(async () => {
        const createBtn = screen.getByTestId(`${testId}-confirm-btn`);

        await userEvent.click(createBtn);

        expect(commonProps.onConfirmPublicLink).toBeCalledWith(false);
      });
    });
  });

  describe('When a public link is returned', () => {
    beforeEach(() => {
      fakeRequest.mockReturnValue(new Promise((res) => res(testResponse)));

      renderWithProviders(<PublicLinkToggle {...commonProps} />);
    });

    test('It renders in the correct state', async () => {
      jest.runAllTicks();

      await waitFor(() => {
        expect(fakeRequest).toBeCalledWith(`/applets/${commonProps.appletId}/access_link`, {
          signal: undefined,
        });

        const deleteBtn = screen.getByTestId(`${testId}-confirm-btn`);
        const input = screen.getByTestId(`${testId}-input`);

        expect(deleteBtn).toBeInTheDocument();
        expect(deleteBtn.textContent).toBe('Delete Public Link');
        expect(input).toBeInTheDocument();
        expect(input).toHaveProperty('value', testResponse.data.result.link);
        expect(screen.queryByTestId(`${testId}-copy-btn`)).toBeInTheDocument();
      });
    });

    test('It calls `onConfirmPublicLink` with the appropriate parameter', async () => {
      jest.runAllTicks();

      await waitFor(async () => {
        const createBtn = screen.getByTestId(`${testId}-confirm-btn`);

        await userEvent.click(createBtn);

        expect(commonProps.onConfirmPublicLink).toBeCalledWith(true);
      });
    });

    test('It allows copying the returned value to the clipboard', async () => {
      jest.runAllTicks();
      const user = userEvent.setup();

      await waitFor(async () => {
        user.click(screen.getByTestId(`${testId}-copy-btn`));

        const clipboardText = await navigator.clipboard.readText();

        expect(clipboardText).toBe(testResponse.data.result.link);
      });
    });
  });
});
