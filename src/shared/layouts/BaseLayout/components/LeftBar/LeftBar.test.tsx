// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedUserData } from 'shared/mock';
import * as reduxHooks from 'redux/store/hooks';
import { auth, workspaces } from 'redux/modules';

import { LeftBar } from './LeftBar';

const mockedCurrentWorkspaceData = {
  ownerId: mockedUserData.id,
  workspaceName: 'Jane Doe',
};

const mockedWorkspacesData = [
  {
    ownerId: mockedUserData.id,
    workspaceName: 'Workspace 2',
  },
  mockedCurrentWorkspaceData,
];

const mockDispatch = jest.fn();
jest.mock('redux/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('LeftBar component', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    jest.spyOn(workspaces, 'useWorkspacesData').mockReturnValue({ result: mockedWorkspacesData });
    jest.spyOn(workspaces, 'useData').mockReturnValue(mockedCurrentWorkspaceData);

    renderWithProviders(<LeftBar />);
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
});
