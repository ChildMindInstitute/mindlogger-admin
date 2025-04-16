// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { WorkspaceGroup } from './WorkspaceGroup';

const mockOnChangeWorkspace = vi.fn();

const workspacesGroup = {
  groupName: 'Group Name',
  workspaces: [
    {
      ownerId: '1',
      workspaceName: 'Workspace 1',
      image: 'workspace1.jpg',
    },
    {
      ownerId: '2',
      workspaceName: 'Workspace 2',
      image: 'workspace2.jpg',
    },
  ],
  emptyState: 'No workspaces found',
};

const dataTestid = 'workspace-group';
const commonProps = {
  workspacesGroup,
  onChangeWorkspace: mockOnChangeWorkspace,
  'data-testid': dataTestid,
};

jest.mock('redux/modules', () => ({
  workspaces: {
    useData: () => ({ ownerId: '1' }),
  },
}));

describe('WorkspaceGroup', () => {
  test('should render group name correctly', () => {
    renderWithProviders(<WorkspaceGroup {...commonProps} />);

    expect(screen.getByText(workspacesGroup.groupName)).toBeInTheDocument();
  });

  test('should render workspaces correctly', () => {
    renderWithProviders(<WorkspaceGroup {...commonProps} />);

    const workspaceNames = workspacesGroup.workspaces.map((workspace) => workspace.workspaceName);
    workspaceNames.forEach((workspaceName) => {
      expect(screen.getByText(workspaceName)).toBeInTheDocument();
    });
  });

  test('should call onChangeWorkspace when a workspace is clicked', async () => {
    renderWithProviders(<WorkspaceGroup {...commonProps} />);

    const workspaceButton = screen.getByTestId(`${dataTestid}-workspace-1`);
    await userEvent.click(workspaceButton);

    expect(mockOnChangeWorkspace).toHaveBeenCalledWith(workspacesGroup.workspaces[1]);
  });

  test('should highlight the selected workspace', () => {
    renderWithProviders(<WorkspaceGroup {...commonProps} />);

    const selectedWorkspaceButton = screen.getByTestId(`${dataTestid}-workspace-0`);
    expect(selectedWorkspaceButton).toHaveClass('Mui-selected');
  });

  test('should render empty state when no workspaces are found', () => {
    const emptyState = 'No workspaces found';
    const emptyWorkspacesGroup = {
      ...workspacesGroup,
      workspaces: [],
      emptyState,
    };

    renderWithProviders(
      <WorkspaceGroup
        workspacesGroup={emptyWorkspacesGroup}
        onChangeWorkspace={mockOnChangeWorkspace}
      />,
    );

    expect(screen.getByText(emptyState)).toBeInTheDocument();
  });
});
