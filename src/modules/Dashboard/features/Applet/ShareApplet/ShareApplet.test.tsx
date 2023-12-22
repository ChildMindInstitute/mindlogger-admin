// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { mockedApplet } from 'shared/mock';
import { ApiResponseCodes } from 'api';

import { ShareApplet } from './ShareApplet';

const dataTestid = 'share-applet';
const appletName = 'displayName';

const onAppletSharedMock = jest.fn();

const defaultProps = {
  applet: mockedApplet,
  onAppletShared: onAppletSharedMock,
  onDisableSubmit: jest.fn(),
  isSubmitted: false,
  setIsSubmitted: jest.fn(),
  showSuccess: true,
  'data-testid': dataTestid,
};

const checkAppletNameInLibraryMock = () =>
  expect(mockAxios.post).toHaveBeenNthCalledWith(
    1,
    '/library/check_name',
    { name: appletName },
    { signal: undefined },
  );

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('ShareApplet Component', () => {
  beforeAll(() => {
    navigator.clipboard.writeText.mockResolvedValue(undefined);
  });

  test('renders the ShareApplet component with default values', () => {
    render(<ShareApplet {...defaultProps} />);

    expect(screen.getByTestId(`${dataTestid}-form`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-applet-name`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-keywords`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-agreement`)).toBeInTheDocument();
  });

  test('applet name is not taken', async () => {
    mockAxios.post.mockResolvedValueOnce({
      payload: {
        response: {
          status: ApiResponseCodes.SuccessfulResponse,
          data: null,
        },
      },
    });

    render(<ShareApplet {...defaultProps} />);

    await waitFor(checkAppletNameInLibraryMock);

    const appletNameContainer = screen.getByTestId(`${dataTestid}-applet-name`);
    const appletNameInput = appletNameContainer.querySelector('input');

    expect(appletNameInput).toBeDisabled();
  });

  test('handles applet name already taken error', async () => {
    mockAxios.post.mockRejectedValueOnce({
      payload: {
        response: {
          status: ApiResponseCodes.Forbidden,
          data: null,
        },
      },
    });

    render(<ShareApplet {...defaultProps} />);

    await waitFor(checkAppletNameInLibraryMock);

    const appletNameContainer = screen.getByTestId(`${dataTestid}-applet-name`);
    const appletNameInput = appletNameContainer.querySelector('input');

    expect(appletNameInput).not.toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByText(
          /This Applet name is already taken in the Library. Please rename the Applet to share it./,
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Note: This will change the name of the Applet for your users./),
      ).toBeInTheDocument();
    });
  });

  test('handle share applet and copy applet link', async () => {
    const libraryUrl = 'library-url';
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: {
          url: libraryUrl,
        },
      },
    });

    const { rerender } = render(<ShareApplet {...defaultProps} />);

    const keywordsContainer = screen.getByTestId(`${dataTestid}-keywords`);
    const keywordsInput = keywordsContainer.querySelector('input') as HTMLElement;
    const mockedKeyword = 'Mocked keyword';

    fireEvent.change(keywordsInput, {
      target: { value: mockedKeyword },
    });
    fireEvent.keyDown(keywordsInput, { key: 'Enter' });

    expect(screen.getByText(mockedKeyword)).toBeInTheDocument();

    rerender(<ShareApplet {...defaultProps} isSubmitted />);

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenNthCalledWith(
        3,
        '/library',
        { appletId: mockedApplet.id, name: appletName, keywords: [mockedKeyword] },
        { signal: undefined },
      );

      expect(mockAxios.get).toHaveBeenNthCalledWith(1, `/applets/${mockedApplet.id}/library_link`, {
        signal: undefined,
      });
    });

    expect(onAppletSharedMock).toHaveBeenCalledWith({
      keywords: [mockedKeyword],
      libraryUrl,
      appletName,
    });

    const copyLink = screen.getByTestId(`${dataTestid}-shared-copy-link`);
    fireEvent.click(copyLink);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(libraryUrl);

    await waitFor(() => {
      expect(screen.getByText('Link successfully copied')).toBeInTheDocument();
    });
  });
});
