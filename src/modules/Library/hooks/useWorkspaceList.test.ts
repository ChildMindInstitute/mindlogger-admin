import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderHookWithProviders } from 'shared/utils';

import { useWorkspaceList } from './useWorkspaceList';

const ownerId1 = 'c48b275d-db4b-4f79-8469-9198b45985d3';
const ownerId2 = '1142430a-5160-4e4b-9090-7bc944cffa63';

const workspacesResult = [
  {
    ownerId: ownerId1,
    workspaceName: 'Jane Doe',
    workspaceRoles: {
      '14140005-730d-4084-ad07-41366e80568e': ['owner'],
      'fd238f22-d03a-4fdb-8c77-841155210a47': ['manager'],
    },
  },
];

const mockGetWorkspaces = {
  data: {
    result: [
      {
        ownerId: ownerId1,
        workspaceName: 'Jane Doe',
      },
      {
        ownerId: ownerId2,
        workspaceName: 'CMI',
      },
    ],
    count: 2,
  },
};

const mockGetWorkspaceRoles1 = {
  data: {
    result: {
      '14140005-730d-4084-ad07-41366e80568e': ['owner'],
      'fd238f22-d03a-4fdb-8c77-841155210a47': ['manager'],
    },
  },
};

const mockGetWorkspaceRoles2 = {
  data: {
    result: {
      '55b8c42f-1946-434b-98bc-85d58520dd67': ['respondent'],
    },
  },
};

const fetchWorkspacesData = async () => {
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenNthCalledWith(1, '/workspaces', {
      signal: undefined,
    });
  });

  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenNthCalledWith(2, `/workspaces/${ownerId1}/roles`, {
      params: {},
      signal: undefined,
    });

    expect(mockAxios.get).toHaveBeenNthCalledWith(3, `/workspaces/${ownerId2}/roles`, {
      params: {},
      signal: undefined,
    });
  });
};

describe('useWorkspaceList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should set item in storage if not authorized (success)', () => {
    const { result } = renderHookWithProviders(() => useWorkspaceList(false));
    expect(result.current).toEqual({
      checkIfHasAccessToWorkspace: expect.any(Function),
      isLoading: true,
      workspaces: [],
    });
  });

  test('should remove item from storage if authorized (failed)', async () => {
    mockAxios.get.mockResolvedValueOnce(mockGetWorkspaces);
    mockAxios.get.mockResolvedValueOnce(mockGetWorkspaceRoles1);
    mockAxios.get.mockResolvedValueOnce(mockGetWorkspaceRoles2);

    const { result } = renderHookWithProviders(() => useWorkspaceList(true));

    await fetchWorkspacesData();

    await waitFor(() => {
      expect(result.current).toEqual({
        checkIfHasAccessToWorkspace: expect.any(Function),
        isLoading: false,
        workspaces: workspacesResult,
      });
    });
  });

  test('should remove item from storage if authorized', async () => {
    mockAxios.get.mockResolvedValueOnce(mockGetWorkspaces);
    mockAxios.get.mockResolvedValueOnce(mockGetWorkspaceRoles1);
    mockAxios.get.mockRejectedValue(new Error('Error'));

    const { result } = renderHookWithProviders(() => useWorkspaceList(true));

    await fetchWorkspacesData();

    await waitFor(() => {
      expect(result.current).toEqual({
        checkIfHasAccessToWorkspace: expect.any(Function),
        isLoading: false,
        workspaces: [],
      });
    });
  });
});
