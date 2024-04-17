// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { generatePath } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletData } from 'shared/mock';

import { LinkForm } from './LinkForm';

const dataTestid = 'dashboard-add-users-generate-link';
const link = 'https://example.com/join/8bac1a7e-9c72-472a-a722-21ece63af1e1';
const setInviteLink = jest.fn();
const getProps = (requireLogin = false) => ({
  setInviteLink,
  inviteLink: {
    link,
    requireLogin,
  },
});

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const checkDeleteButtonAndHelperText = () => {
  expect(screen.getByText('Delete invite link')).toBeInTheDocument();
  expect(
    screen.getByText('Delete this link no longer allow anyone to access url'),
  ).toBeInTheDocument();
};

describe('LinkForm', () => {
  beforeAll(() => {
    navigator.clipboard.writeText.mockResolvedValue(undefined);
  });

  test('renders LinkForm component when login is not required, opens popup, calls deleteAppletPublicLink callback', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    renderWithProviders(<LinkForm {...getProps()} />, {
      routePath: page.appletAddUser,
      route: generatePath(page.appletAddUser, {
        appletId: mockedAppletData.id,
      }),
    });

    expect(
      screen.getByText(
        'Share the following link for respondents to take assessment without account.',
      ),
    ).toBeInTheDocument();

    const inputContainer = screen.getByTestId(`${dataTestid}-url`);
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(link);

    expect(screen.getByTestId(`${dataTestid}-url-copy`)).toBeInTheDocument();

    const deleteButton = screen.getByTestId(`${dataTestid}-url-delete`);
    expect(deleteButton).toBeInTheDocument();

    checkDeleteButtonAndHelperText();

    fireEvent.click(deleteButton);

    const deleteConfirmationPopup = screen.getByTestId(`${dataTestid}-delete-popup`);
    expect(deleteConfirmationPopup).toBeInTheDocument();

    expect(screen.getByText('Delete Public Link')).toBeInTheDocument();

    expect(
      screen.getByText(
        'If deleted, the public link will become invalid, and the respondents will not be able to use it anymore. Are you sure you want to delete it?',
      ),
    ).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-delete-popup-close-button`);
    fireEvent.click(closeButton);

    expect(deleteConfirmationPopup).not.toBeInTheDocument();

    fireEvent.click(deleteButton);

    const popupDeleteButton = screen.getByTestId(`${dataTestid}-delete-popup-submit-button`);
    expect(popupDeleteButton).toBeInTheDocument();
    fireEvent.click(popupDeleteButton);

    expect(mockAxios.delete).toHaveBeenNthCalledWith(
      1,
      `/applets/${mockedAppletData.id}/access_link`,
      {
        signal: undefined,
      },
    );

    await waitFor(() => expect(setInviteLink).toHaveBeenCalled());
  });

  test('renders LinkForm component when login is required, calls copyPublicLink', () => {
    renderWithProviders(<LinkForm {...getProps(true)} />);

    expect(
      screen.getByText('Share the following link to invite anyone to this study.'),
    ).toBeInTheDocument();

    const inputContainer = screen.getByTestId(`${dataTestid}-url`);
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(link);

    const copyButton = screen.getByTestId(`${dataTestid}-url-copy`);
    expect(copyButton).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-url-delete`)).toBeInTheDocument();

    checkDeleteButtonAndHelperText();

    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link);
  });

  test('renders LinkForm component when inviteLink is null', () => {
    renderWithProviders(<LinkForm setInviteLink={setInviteLink} inviteLink={null} />);

    expect(
      screen.getByText(
        'Share the following link for respondents to take assessment without account.',
      ),
    ).toBeInTheDocument();

    const inputContainer = screen.getByTestId(`${dataTestid}-url`);
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });
});
