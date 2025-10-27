import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedEncryption,
  mockedOwnerId,
} from 'shared/mock';
import { initialStateData } from 'shared/state/Base';
import { Roles } from 'shared/consts';
import { ApiResponseCodes } from 'api';

import { Applets } from './Applets';

const getPreloadedState = (role = Roles.Manager) => ({
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [role],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
});

const successfulGetFoldersMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        id: '1d05996a-099a-4f28-bf3e-fffe97fdf3d8',
        name: 'Folder9',
        appletCount: 1,
      },
    ],
    count: 1,
  },
};

const successfulGetExpandedAppletsMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        id: 'mockedAppletId',
        displayName: 'Expanded Applet',
        image: '',
        isPinned: false,
        encryption: mockedEncryption,
        createdAt: '2023-07-18T08:22:04.604160',
        updatedAt: '2023-11-03T10:39:28.606286',
        version: '43.0.1',
        role: 'owner',
        type: 'applet',
        foldersAppletCount: 0,
        description: {
          en: '',
        },
        activityCount: 3,
      },
    ],
    count: 1,
  },
};

const mockedFolderId = '1d05996a-099a-4f28-bf3e-fffe97fdf3d8';

const successfulGetAppletsMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        id: mockedFolderId,
        displayName: 'Folder9',
        image: '',
        isPinned: false,
        encryption: null,
        createdAt: '2023-05-29T10:45:38.474093',
        updatedAt: '2023-05-29T10:45:38.474100',
        version: '',
        role: null,
        type: 'folder',
        foldersAppletCount: 1,
        description: null,
        activityCount: null,
      },
      {
        id: mockedAppletId,
        displayName: 'MockedApplet',
        image: '',
        isPinned: false,
        encryption: mockedEncryption,
        createdAt: '2023-07-18T08:22:04.604160',
        updatedAt: '2023-11-03T10:39:28.606286',
        version: '43.0.1',
        role: 'owner',
        type: 'applet',
        foldersAppletCount: 0,
        description: {
          en: '',
        },
        activityCount: 5,
      },
    ],
    count: 1,
  },
};

const successfulEmptyGetMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
    count: 0,
  },
};

const mockedUseNavigate = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('Applets component tests', () => {
  test('should render empty component', async () => {
    vi.mocked(axios.get).mockResolvedValue(successfulEmptyGetMock);
    renderWithProviders(<Applets />, { preloadedState: getPreloadedState() });

    await waitFor(() => {
      expect(
        screen.getByText(
          'No Applets yet. Create your first one by clicking the ‘Add Applet’ button above.',
        ),
      ).toBeInTheDocument();
    });
  });

  test('should render table with rows', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    renderWithProviders(<Applets />, { preloadedState: getPreloadedState() });

    const rows = ['Folder9', 'MockedApplet'];

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-applets-table')).toBeInTheDocument();
      expect(axios.get).toHaveBeenNthCalledWith(1, `/workspaces/${mockedOwnerId}/folders`, {
        signal: undefined,
      });
      expect(axios.get).toHaveBeenNthCalledWith(2, `/workspaces/${mockedOwnerId}/applets`, {
        params: { limit: 20 },
        signal: undefined,
      });
      rows.forEach((row) => expect(screen.getByText(row)).toBeInTheDocument());
    });
  });

  describe('add Applet button ', () => {
    test.each`
      role                 | exist    | description
      ${Roles.Manager}     | ${true}  | ${'should be for manager'}
      ${Roles.Editor}      | ${true}  | ${'should be for editor'}
      ${Roles.Coordinator} | ${false} | ${'should not be for coordinator'}
      ${Roles.Owner}       | ${false} | ${'should not be for owner'}
      ${Roles.Respondent}  | ${false} | ${'should not be for respondent'}
      ${Roles.Reviewer}    | ${false} | ${'should not be for reviewer'}
      ${Roles.SuperAdmin}  | ${false} | ${'should not be for superAdmin'}
    `('$description', async ({ role, exist }) => {
      vi.mocked(axios.get).mockResolvedValue(successfulEmptyGetMock);
      renderWithProviders(<Applets />, { preloadedState: getPreloadedState(role) });

      await waitFor(() => {
        const expected = expect(screen.queryByTestId('dashboard-applets-add-applet'));
        if (exist) {
          expected.toBeInTheDocument();
        } else {
          expected.not.toBeInTheDocument();
        }
      });
    });

    test('should have menu with navigation items', async () => {
      vi.mocked(axios.get).mockResolvedValue(successfulEmptyGetMock);
      renderWithProviders(<Applets />, { preloadedState: getPreloadedState() });

      const addAppletButton = await waitFor(() =>
        screen.queryByTestId('dashboard-applets-add-applet'),
      );
      addAppletButton && fireEvent.click(addAppletButton);

      await waitFor(() => {
        const menuItems = [
          'dashboard-applets-add-applet-new',
          'dashboard-applets-add-applet-from-library',
        ];
        menuItems.forEach((menuItem) => expect(screen.getByTestId(menuItem)).toBeInTheDocument());
      });

      fireEvent.click(screen.getByTestId('dashboard-applets-add-applet-new'));

      await waitFor(() => expect(mockedUseNavigate).toBeCalledWith('/builder/new-applet'));

      addAppletButton && fireEvent.click(addAppletButton);
      fireEvent.click(screen.getByTestId('dashboard-applets-add-applet-from-library'));

      await waitFor(() => expect(mockedUseNavigate).toBeCalledWith('/library'));
    });
  });

  test('should search applets', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulEmptyGetMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulEmptyGetMock);
    renderWithProviders(<Applets />, { preloadedState: getPreloadedState() });

    const searchInput = screen.getByTestId('dashboard-applets-search').querySelector('input');
    const searchQuery = 'Mock';
    searchInput && fireEvent.change(searchInput, { target: { value: searchQuery } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenNthCalledWith(3, `/workspaces/${mockedOwnerId}/folders`, {
        signal: undefined,
      });
      expect(axios.get).toHaveBeenNthCalledWith(
        4,
        `/workspaces/${mockedOwnerId}/applets/search/${searchQuery}`,
        {
          params: {
            limit: 20,
            page: 1,
          },
          signal: undefined,
        },
      );
    });

    searchInput && fireEvent.change(searchInput, { target: { value: 'NotExistedApplet' } });
    await waitFor(() => {
      expect(
        screen.getByText(
          "No match was found for 'NotExistedApplet'. Try a different search word or phrase.",
        ),
      ).toBeInTheDocument;
    });
  });

  test('should add folder', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    vi.mocked(axios.post).mockResolvedValueOnce({
      status: ApiResponseCodes.SuccessfulResponse,
      data: {
        result: {
          id: '1d05996a-099a-4f28-bf3e-ddd',
          name: 'New Folder',
          appletCount: 0,
        },
      },
    });
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    renderWithProviders(<Applets />, { preloadedState: getPreloadedState() });

    const addFolderButton = await waitFor(() => screen.getByTestId('dashboard-applets-add-folder'));
    fireEvent.click(addFolderButton);
    const input = screen.getByPlaceholderText('New Folder') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(
        1,
        `/workspaces/${mockedOwnerId}/folders`,
        { name: 'New Folder' },
        { signal: undefined },
      );
    });
  });

  test('should expand and collapse folder', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetFoldersMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    renderWithProviders(<Applets />, { preloadedState: getPreloadedState() });

    const folder = await waitFor(() => screen.getByText('Folder9'));
    fireEvent.click(folder);

    await waitFor(() => {
      expect(axios.get).toHaveBeenLastCalledWith(
        `/workspaces/${mockedOwnerId}/folders/${mockedFolderId}/applets`,
        { signal: undefined },
      );
      expect(screen.getByText('Expanded Applet')).toBeInTheDocument();
    });

    fireEvent.click(folder);
    await waitFor(() => expect(screen.queryByText('Expanded Applet')).not.toBeInTheDocument());
  });
});
