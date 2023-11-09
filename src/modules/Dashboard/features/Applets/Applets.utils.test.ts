import { Applet, Folder } from 'api';

import { generateNewFolderName, getAppletsWithLocalFolders } from './Applets.utils';

describe('generateNewFolderName', () => {
  const folders1 = [
    {
      id: '1',
      displayName: 'Display Name',
    },
  ];

  const folders2 = [
    {
      id: '1',
      displayName: 'Folder 1',
    },
    {
      id: '2',
      displayName: 'New Folder',
    },
  ];

  const folders3 = [
    {
      id: '1',
      displayName: 'Display Name',
    },
    {
      id: '2',
      displayName: 'New Folder',
    },
    {
      id: '3',
      displayName: 'New Folder (2)',
    },
    {
      id: '4',
      displayName: 'New Folder (1)',
    },
  ];

  test.each`
    folders     | expected            | description
    ${folders1} | ${'New Folder'}     | ${'should generate New Folder'}
    ${folders2} | ${'New Folder (1)'} | ${'should generate New Folder(1)'}
    ${folders3} | ${'New Folder (3)'} | ${'should generate New Folder(3)'}
  `('$description', ({ folders, expected }) => {
    const result = generateNewFolderName(folders);
    expect(result).toBe(expected);
  });
});

describe('getAppletsWithLocalFolders Function', () => {
  test('should group applets by folders and include folders', () => {
    const applets = [
      { id: 'applet1', folderId: 'folder1', displayName: 'Applet 1' },
      { id: 'applet2', folderId: 'folder1', displayName: 'Applet 2' },
      { id: 'applet3', folderId: 'folder2', displayName: 'Applet 3' },
    ] as Applet[];

    const folders = [
      { id: 'folder1', displayName: 'Folder 1' },
      { id: 'folder2', displayName: 'Folder 2' },
    ] as Folder[];

    const expandedFolders = ['folder1'];

    const result = getAppletsWithLocalFolders(applets, folders, expandedFolders);

    expect(result).toEqual([
      { id: 'folder1', displayName: 'Folder 1', isFolder: true, foldersAppletCount: 2 },
      {
        id: 'applet1',
        folderId: 'folder1',
        displayName: 'Applet 1',
        isFolder: false,
        parentId: 'folder1',
      },
      {
        id: 'applet2',
        folderId: 'folder1',
        displayName: 'Applet 2',
        isFolder: false,
        parentId: 'folder1',
      },
      { id: 'folder2', displayName: 'Folder 2', isFolder: true, foldersAppletCount: 1 },
    ]);
  });

  test('should include non-folder applets without a folder', () => {
    const applets = [
      { id: 'applet1', displayName: 'Applet 1' },
      { id: 'applet2', folderId: 'folder1', displayName: 'Applet 2' },
      { id: 'applet3', folderId: 'folder2', displayName: 'Applet 3' },
    ] as Applet[];

    const folders = [
      { id: 'folder1', displayName: 'Folder 1' },
      { id: 'folder2', displayName: 'Folder 2' },
    ] as Folder[];

    const expandedFolders = ['folder1'];

    const result = getAppletsWithLocalFolders(applets, folders, expandedFolders);

    expect(result).toEqual([
      { id: 'applet1', displayName: 'Applet 1' },
      { id: 'folder1', displayName: 'Folder 1', isFolder: true, foldersAppletCount: 1 },
      {
        id: 'applet2',
        folderId: 'folder1',
        displayName: 'Applet 2',
        isFolder: false,
        parentId: 'folder1',
      },
      { id: 'folder2', displayName: 'Folder 2', isFolder: true, foldersAppletCount: 1 },
    ]);
  });
});
