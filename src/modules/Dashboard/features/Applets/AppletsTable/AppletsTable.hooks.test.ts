// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useContext } from 'react';
import { act, renderHook } from '@testing-library/react';

import { useAsync } from 'shared/hooks/useAsync';

import { useAppletsDnd } from './AppletsTable.hooks';

const mockAppletContextValue = {
  rows: [],
  fetchData: jest.fn(),
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('shared/hooks/useAsync', () => ({
  useAsync: jest.fn(),
}));

jest.mock('api', () => ({
  setFolderApi: jest.fn(),
}));

describe('useAppletsDnd', () => {
  beforeEach(() => {
    (useAsync as jest.Mock).mockReturnValue({ execute: jest.fn() });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('returns initial state', () => {
    (useContext as jest.Mock).mockReturnValue(mockAppletContextValue);

    const { result } = renderHook(() => useAppletsDnd());
    expect(result.current.isDragOver).toBe(false);
    expect(typeof result.current.onDragLeave).toBe('function');
    expect(typeof result.current.onDragOver).toBe('function');
    expect(typeof result.current.onDrop).toBe('function');
    expect(typeof result.current.onDragEnd).toBe('function');
  });

  test('onDragLeave updates isDragOver to false', () => {
    const onDragLeaveParams = { preventDefault: jest.fn(), persist: jest.fn() };
    (useContext as jest.Mock).mockReturnValue(mockAppletContextValue);

    const { result } = renderHook(() => useAppletsDnd());
    act(() => {
      result.current.onDragLeave(onDragLeaveParams);
    });
    expect(result.current.isDragOver).toBe(false);
  });

  test('onDragOver updates isDragOver to true', () => {
    const onDragOverParams = { preventDefault: jest.fn() };
    (useContext as jest.Mock).mockReturnValue(mockAppletContextValue);

    const { result } = renderHook(() => useAppletsDnd());
    act(() => {
      result.current.onDragOver(onDragOverParams);
    });
    expect(result.current.isDragOver).toBe(true);
  });

  test('onDragEnd calls setFolder and fetchData if drag effect is none and applet has parent id', async () => {
    const mockedEvent = {
      preventDefault: jest.fn(),
      dataTransfer: { dropEffect: 'none' },
    };
    const mockApplet = { id: 'mockedAppletId', parentId: 'mockedParentId' };
    const mockFetchData = jest.fn();
    const mockSetFolder = jest.fn().mockResolvedValueOnce(undefined);

    (useContext as jest.Mock).mockReturnValue({
      ...mockAppletContextValue,
      fetchData: mockFetchData,
    });
    (useAsync as jest.Mock).mockReturnValue({ execute: mockSetFolder });

    const { result } = renderHook(() => useAppletsDnd());

    await act(() => {
      result.current.onDragEnd(mockedEvent, mockApplet);
    });

    expect(mockSetFolder).toHaveBeenCalledWith({ appletId: mockApplet.id });
    expect(mockFetchData).toHaveBeenCalled();
  });

  test('onDrop handles moving applet within the same folder correctly', async () => {
    const mockedEvent = {
      preventDefault: jest.fn(),
      persist: jest.fn(),
      dataTransfer: {
        getData: () => 'draggedItemId',
      },
    };
    const draggedItem = { id: 'draggedItemId', parentId: 'folderId' };
    const folder = { id: 'folderId', isFolder: true };
    const previousFolder = { id: 'folderId' };

    const mockSetFolder = jest.fn().mockResolvedValueOnce(undefined);
    (useContext as jest.Mock).mockReturnValue({
      ...mockAppletContextValue,
      rows: [draggedItem, folder, previousFolder],
    });
    (useAsync as jest.Mock).mockReturnValue({ execute: mockSetFolder });

    const { result } = renderHook(() => useAppletsDnd());

    await act(async () => {
      await result.current.onDrop(mockedEvent, folder);
    });

    expect(mockSetFolder).toBeCalledWith({ appletId: draggedItem.id });
    expect(mockAppletContextValue.fetchData).toHaveBeenCalledTimes(1);
  });

  test('onDrop handles moving applet to a new folder correctly', async () => {
    const mockedEvent = {
      preventDefault: jest.fn(),
      persist: jest.fn(),
      dataTransfer: {
        getData: () => 'draggedItemId',
      },
    };
    const draggedItem = { id: 'draggedItemId', parentId: 'previousFolderId' };
    const folder = { id: 'folderId', isFolder: true };
    const previousFolder = { id: 'previousFolderId' };

    const mockSetFolder = jest.fn().mockResolvedValueOnce(undefined);
    (useContext as jest.Mock).mockReturnValue({
      ...mockAppletContextValue,
      rows: [draggedItem, folder, previousFolder],
    });
    (useAsync as jest.Mock).mockReturnValue({ execute: mockSetFolder });

    const { result } = renderHook(() => useAppletsDnd());

    await act(async () => {
      await result.current.onDrop(mockedEvent, folder);
    });

    expect(mockSetFolder).toHaveBeenCalledWith({ appletId: draggedItem.id, folderId: folder.id });
    expect(mockSetFolder).toHaveBeenCalledTimes(1);
    expect(mockAppletContextValue.fetchData).toHaveBeenCalledTimes(1);
  });
});
