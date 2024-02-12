import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { initialStateData } from 'shared/state';

import { SwitchWorkspace } from './SwitchWorkspace';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: initialStateData,
    roles: initialStateData,
    workspacesRoles: initialStateData,
  },
};

const mockedWorkspaces = [{ ownerId: '1111', workspaceName: 'Mocked Workspace' }];
const mockedDataTestId = 'mockedDataTestId';

describe('SwitchWorkspace component tests', () => {
  test('should appear empty drawer', () => {
    renderWithProviders(
      <SwitchWorkspace
        setVisibleDrawer={jest.fn}
        visibleDrawer={true}
        workspaces={[]}
        onChangeWorkspace={jest.fn}
        data-testid={mockedDataTestId}
      />,
      { preloadedState },
    );

    expect(screen.getByTestId(mockedDataTestId)).toBeInTheDocument();
    expect(screen.getByText('My Workspace')).toBeInTheDocument();
    expect(screen.getByText('Shared Workspaces')).toBeInTheDocument();
    expect(screen.getByText('No shared Workspaces')).toBeInTheDocument();
  });

  test('should appear drawer with shared workspace', () => {
    renderWithProviders(
      <SwitchWorkspace
        setVisibleDrawer={jest.fn}
        visibleDrawer={true}
        onChangeWorkspace={jest.fn}
        workspaces={mockedWorkspaces}
        data-testid={mockedDataTestId}
      />,
      { preloadedState },
    );

    expect(screen.getByTestId(`${mockedDataTestId}-workspace-group-1-workspace-0`)).toBeInTheDocument();
    expect(screen.getByText('Mocked Workspace')).toBeInTheDocument();
  });

  test('should close drawer', () => {
    const setVisibleDrawerMockFn = jest.fn();
    renderWithProviders(
      <SwitchWorkspace
        setVisibleDrawer={setVisibleDrawerMockFn}
        visibleDrawer={true}
        workspaces={mockedWorkspaces}
        onChangeWorkspace={jest.fn}
        data-testid={mockedDataTestId}
      />,
      { preloadedState },
    );

    fireEvent.click(screen.getByTestId(`${mockedDataTestId}-close`));
    expect(setVisibleDrawerMockFn).nthCalledWith(1, false);
  });
});
