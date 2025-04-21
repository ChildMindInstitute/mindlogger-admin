import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { authApiClient } from 'shared/api/apiConfig';

import { PublicLinkPopup } from './PublicLinkPopup';

// Mock the API modules
vi.mock('shared/api/apiConfig', () => ({
  authApiClient: {
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

// Import the mocked module after mocking

const testId = 'public-link-popup';
const commonProps = {
  open: true,
  appletId: 'test-applet-id',
  'data-testid': testId,
  onClose: vi.fn(),
};

describe('PublicLinkPopup', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('When `hasPublicLink` is `true`', () => {
    beforeEach(() => {
      renderWithProviders(<PublicLinkPopup {...commonProps} hasPublicLink />);

      vi.mocked(authApiClient.delete).mockResolvedValue(
        mockSuccessfulHttpResponse({ status: 204 }),
      );
    });

    test('It renders in the correct state', async () => {
      expect(screen.queryByTestId(`${testId}-delete-btn`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-no-account-btn`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-account-btn`)).not.toBeInTheDocument();
    });

    test('Calls the deletePublicLink endpoint', async () => {
      const deleteBtn = screen.getByTestId(`${testId}-delete-btn`);

      await userEvent.click(deleteBtn);

      expect(vi.mocked(authApiClient.delete)).toBeCalledWith(
        `/applets/${commonProps.appletId}/access_link`,
        {
          signal: undefined,
        },
      );
    });
  });

  describe('When `hasPublicLink` is `false`', () => {
    beforeEach(() => {
      renderWithProviders(<PublicLinkPopup {...commonProps} />);

      vi.mocked(authApiClient.post).mockResolvedValue(mockSuccessfulHttpResponse({ result: true }));
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

        expect(vi.mocked(authApiClient.post)).toBeCalledWith(
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

        expect(vi.mocked(authApiClient.post)).toBeCalledWith(
          `/applets/${commonProps.appletId}/access_link`,
          { requireLogin: false },
          { signal: undefined },
        );
      });
    });
  });
});
