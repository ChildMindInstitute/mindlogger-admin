// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedUserData } from 'shared/mock';

import { LeftBar } from './LeftBar';

const getPreloadedState = (
  currentWorkspaceData: Workspace | null = null,
): PreloadedState<RootState> => ({
  workspaces: {
    workspaces: {
      requestId: 'workspaces-request-id',
      status: 'success',
      data: {
        result: [],
        count: 1,
      },
    },
    currentWorkspace: {
      requestId: 'currentWorkspace-request-id',
      status: 'success',
      data: currentWorkspaceData,
    },
  },
});

const mockedCurrentWorkspaceData = {
  ownerId: mockedUserData.id,
  workspaceName: 'Jane Doe',
};

describe('LeftBar component', () => {
  beforeEach(() => {
    renderWithProviders(<LeftBar />, {
      preloadedState: getPreloadedState(mockedCurrentWorkspaceData),
    });
  });

  test('renders links with correct text and navigation', async () => {
    const workspaceImage = screen.getByTestId('workspace-image');
    expect(workspaceImage).toBeInTheDocument();
    expect(workspaceImage.textContent).toBe('Ja');

    const listItems = screen.getAllByTestId(/left-bar-link-\d+/);
    expect(listItems).toHaveLength(2);

    const linkTexts = ['Dashboard', 'Library'];
    linkTexts.forEach((text) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
    });

    // check if NavLink components are rendered with the correct 'to' prop
    const linkPaths = ['/dashboard', '/library'];
    linkPaths.forEach((path, index) => {
      const navLink = screen.getByTestId(`left-bar-link-${index}`);
      const anchorElement = navLink.querySelector('a');

      expect(anchorElement).toBeInTheDocument();
      expect(anchorElement).toHaveAttribute('href', path);
    });
  });

  test('toggles workspace drawer visibility on logo click', async () => {
    // check if the workspace drawer is initially hidden
    const workspaceDrawer = screen.queryByTestId('left-bar-workspaces-drawer');
    expect(workspaceDrawer).toBeNull();

    // click on the  workspace image to toggle the visibility of the drawer
    const workspaceImage = await screen.findByTestId('workspace-image');
    await userEvent.click(workspaceImage);

    // wait for the drawer to be visible
    await waitFor(() => {
      const visibleWorkspaceDrawer = screen.getByTestId('left-bar-workspaces-drawer');
      expect(visibleWorkspaceDrawer).toBeInTheDocument();
    });
  });
});
