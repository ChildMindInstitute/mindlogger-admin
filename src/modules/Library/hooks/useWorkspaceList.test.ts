import { waitFor } from '@testing-library/react';
import axios from 'axios';

import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

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
    expect(axios.get).toHaveBeenNthCalledWith(1, '/workspaces', {
      signal: undefined,
    });
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenNthCalledWith(2, `/workspaces/${ownerId1}/roles`, {
      params: {},
      signal: undefined,
    });

    expect(axios.get).toHaveBeenNthCalledWith(3, `/workspaces/${ownerId2}/roles`, {
      params: {},
      signal: undefined,
    });
  });
};

describe('useWorkspaceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    vi.mocked(axios.get).mockResolvedValueOnce(mockGetWorkspaces);
    vi.mocked(axios.get).mockResolvedValueOnce(mockGetWorkspaceRoles1);
    vi.mocked(axios.get).mockResolvedValueOnce(mockGetWorkspaceRoles2);

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
    vi.mocked(axios.get).mockResolvedValueOnce(mockGetWorkspaces);
    vi.mocked(axios.get).mockResolvedValueOnce(mockGetWorkspaceRoles1);
    vi.mocked(axios.get).mockRejectedValue(new Error('Error'));

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
