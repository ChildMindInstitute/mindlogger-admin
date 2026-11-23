import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { CopyActivityModal } from './CopyActivityModal';

const dataTestid = 'copy-activity-modal';
const ownerId = 'owner-id';

const getApplet = (id: string) => ({
  id,
  displayName: `Applet ${id}`,
  image: '',
  role: 'editor',
  type: 'applet',
});

describe('CopyActivityModal', () => {
  test('allows picking only one applet before copying', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { result: [getApplet('current'), getApplet('one'), getApplet('two')], count: 3 },
    });

    renderWithProviders(
      <CopyActivityModal
        isOpen
        activityName="Activity 1"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        data-testid={dataTestid}
      />,
      {
        route: '/builder/current/activities',
        routePath: page.builderAppletActivities,
        preloadedState: { workspaces: { currentWorkspace: { data: { ownerId } } } },
      },
    );

    expect(screen.getByText('Choose where to copy “Activity 1”')).toBeInTheDocument();

    // The current applet is not listed
    await waitFor(() => expect(screen.getByText('Applet one')).toBeInTheDocument());
    expect(screen.queryByText('Applet current')).not.toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    expect(copyButton).toBeDisabled();

    const [first, second] = screen.getAllByRole('checkbox');
    await userEvent.click(first);

    expect(copyButton).toBeEnabled();
    expect(second).toBeDisabled();
  });
});
