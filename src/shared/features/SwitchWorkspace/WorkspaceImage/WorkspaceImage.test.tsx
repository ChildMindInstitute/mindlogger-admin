import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { WorkspaceImage } from './WorkspaceImage';
import { WorkspaceUiType } from './WorkspaceImage.types';

describe('WorkspaceImage', () => {
  test('should render image when image prop is provided', () => {
    const image = 'workspace1.jpg';
    const workspaceName = 'Workspace 1';

    renderWithProviders(
      <WorkspaceImage uiType={WorkspaceUiType.List} image={image} workspaceName={workspaceName} />,
    );

    const imageElement = screen.getByTestId('workspace-image');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.childNodes[0]).toHaveAttribute('src', image);
  });

  test('should render workspace name initials when image prop is not provided', () => {
    const workspaceName = 'Workspace 1';

    renderWithProviders(
      <WorkspaceImage uiType={WorkspaceUiType.List} workspaceName={workspaceName} />,
    );

    const initialsElement = screen.getByText(workspaceName.slice(0, 2));
    expect(initialsElement).toBeInTheDocument();
  });
});
