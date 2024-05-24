import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace, mockedOwnerId } from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';

import * as appletsTableHooks from '../AppletsTable.hooks';
import { FolderItem } from './FolderItem';
import { AppletsContext } from '../../Applets.context';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
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
};

const getMockFolderItem = (isEmpty = true, isNew = false) => ({
  id: 'testId',
  name: 'testName',
  displayName: 'displayedName',
  isFolder: true,
  isNew,
  isRenaming: isNew,
  foldersAppletCount: isEmpty ? 0 : 3,
});

const mockReloadData = jest.fn();
const mockHandleFolderClick = jest.fn();

const mockContext = {
  rows: [mockedApplet],
  setRows: jest.fn(),
  expandedFolders: [],
  reloadData: mockReloadData,
  handleFolderClick: mockHandleFolderClick,
  fetchData: jest.fn(),
};

const commonUseDndProps = {
  onDragLeave: jest.fn(),
  onDragOver: jest.fn(),
  onDrop: jest.fn(),
  onDragEnd: jest.fn(),
};

const getFolderItemComponent = (isEmpty = true, isNew = false) => (
  <AppletsContext.Provider value={mockContext}>
    <table>
      <tbody>
        <FolderItem item={getMockFolderItem(isEmpty, isNew)} />
      </tbody>
    </table>
  </AppletsContext.Provider>
);

describe('FolderItem component tests', () => {
  test('should render folder row', () => {
    renderWithProviders(getFolderItemComponent(), { preloadedState });

    expect(screen.queryByRole('row')).toBeInTheDocument();
    expect(screen.getByText('displayedName')).toBeInTheDocument();
  });

  test('should appear actions on row hover', async () => {
    renderWithProviders(getFolderItemComponent(), { preloadedState });

    const actionsDots = await waitFor(() =>
      screen.getByTestId('dashboard-applets-table-folder-actions-dots'),
    );
    fireEvent.mouseEnter(actionsDots);
    const actionsDataTestIds = [
      'dashboard-applets-folder-rename',
      'dashboard-applets-folder-delete',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
    fireEvent.mouseLeave(actionsDots);
  });

  test('should delete empty folder', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    renderWithProviders(getFolderItemComponent(), { preloadedState });

    const actionsDots = await waitFor(() =>
      screen.getByTestId('dashboard-applets-table-folder-actions-dots'),
    );
    fireEvent.mouseEnter(actionsDots);
    fireEvent.click(screen.getByTestId('dashboard-applets-folder-delete'));

    await waitFor(() => {
      expect(mockAxios.delete).nthCalledWith(1, `/workspaces/${mockedOwnerId}/folders/testId`, {
        signal: undefined,
      });
      expect(mockReloadData).toBeCalled();
    });
  });

  test('should delete new empty folder', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    renderWithProviders(getFolderItemComponent(true, true), { preloadedState });

    const actionsDots = await waitFor(() =>
      screen.getByTestId('dashboard-applets-table-folder-actions-dots'),
    );
    fireEvent.mouseEnter(actionsDots);
    fireEvent.click(screen.getByTestId('dashboard-applets-folder-delete'));

    await waitFor(() => {
      expect(mockAxios.delete).nthCalledWith(1, `/workspaces/${mockedOwnerId}/folders/testId`, {
        signal: undefined,
      });
      expect(mockReloadData).toBeCalled();
    });
  });

  test('shouldnt have possibility to delete folder with applets', async () => {
    renderWithProviders(getFolderItemComponent(false), { preloadedState });

    const actionsDots = await waitFor(() =>
      screen.getByTestId('dashboard-applets-table-folder-actions-dots'),
    );
    fireEvent.mouseEnter(actionsDots);

    const deleteButton = screen.getByTestId('dashboard-applets-folder-delete');
    expect(deleteButton).toBeDisabled();

    fireEvent.mouseEnter(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Cannot delete a folder that contains Applets. Remove Applets from folder before deleting.',
        ),
      ).toBeInTheDocument();
    });
  });

  test('should rename folder', async () => {
    mockAxios.put.mockResolvedValueOnce(null);
    renderWithProviders(getFolderItemComponent(), { preloadedState });

    const actionsDots = await waitFor(() =>
      screen.getByTestId('dashboard-applets-table-folder-actions-dots'),
    );
    fireEvent.mouseEnter(actionsDots);
    fireEvent.click(screen.getByTestId('dashboard-applets-folder-rename'));

    const input = screen.getByPlaceholderText('New Folder') as HTMLInputElement;
    fireEvent.mouseDown(screen.getByTestId('folder-clear-button'));

    expect(input.value).toBe('');

    const newFolderName = 'Renamed Folder';
    fireEvent.change(input, { target: { value: newFolderName } });
    fireEvent.keyDown(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(mockAxios.put).nthCalledWith(
        1,
        `/workspaces/${mockedOwnerId}/folders/testId`,
        { name: newFolderName },
        { signal: undefined },
      );

      expect(mockReloadData).toBeCalled();
    });
  });

  test('should expand folder with applets', () => {
    renderWithProviders(getFolderItemComponent(false), { preloadedState });
    fireEvent.click(screen.getByText('displayedName'));

    expect(mockHandleFolderClick).toBeCalled();
  });

  test('shouldnt expand empty folder', () => {
    renderWithProviders(getFolderItemComponent(), { preloadedState });
    fireEvent.click(screen.getByText('displayedName'));

    expect(mockHandleFolderClick).not.toBeCalled();
  });

  test('should save new folder', async () => {
    renderWithProviders(getFolderItemComponent(false, true), { preloadedState });
    const input = screen.getByPlaceholderText('New Folder');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockAxios.post).toBeCalled();
      expect(mockReloadData).toBeCalled();
    });
  });

  test('should add applet to folder', () => {
    renderWithProviders(getFolderItemComponent(false), { preloadedState });
    fireEvent.drop(screen.getByRole('row'), {
      dataTransfer: {
        getData: () => mockedAppletId,
      },
    });

    expect(mockAxios.post).nthCalledWith(
      1,
      '/applets/set_folder',
      { appletId: mockedAppletId, folderId: 'testId' },
      { signal: undefined },
    );
  });

  test('should have correct classnames for hover and for isDragOver', async () => {
    jest.spyOn(appletsTableHooks, 'useAppletsDnd').mockReturnValue({
      isDragOver: false,
      ...commonUseDndProps,
    });

    const { findByTestId, rerender } = renderWithProviders(getFolderItemComponent(false));

    const tableRow = await findByTestId('dashboard-applets-table-folder-row');

    expect(tableRow).toBeInTheDocument();
    expect(tableRow).toHaveClass('has-hover');
    expect(tableRow).not.toHaveClass('dragged-over');

    jest.spyOn(appletsTableHooks, 'useAppletsDnd').mockReturnValue({
      isDragOver: true,
      ...commonUseDndProps,
    });

    rerender(getFolderItemComponent(false));

    expect(tableRow).toHaveClass('has-hover dragged-over');
  });

  test('should not have classname for hover if folder is empty', async () => {
    jest.spyOn(appletsTableHooks, 'useAppletsDnd').mockReturnValue({
      isDragOver: false,
      ...commonUseDndProps,
    });
    const { findByTestId } = renderWithProviders(getFolderItemComponent(true));

    const tableRow = await findByTestId('dashboard-applets-table-folder-row');

    expect(tableRow).toBeInTheDocument();
    expect(tableRow).not.toHaveClass('has-hover');
  });
});
