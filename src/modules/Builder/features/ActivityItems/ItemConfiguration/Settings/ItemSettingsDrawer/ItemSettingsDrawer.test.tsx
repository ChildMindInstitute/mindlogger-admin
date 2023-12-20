import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ItemSettingsDrawer } from './ItemSettingsDrawer';

const dataTestid = 'builder-activity-items-item';

const onClose = jest.fn();
const props = {
  open: true,
  onClose,
};

describe('ItemSettingsDrawer Component', () => {
  test('renders component with correct title, icons and content when open, calls onClose callback when cross is clicked', () => {
    renderWithProviders(<ItemSettingsDrawer {...props}>Mocked Content</ItemSettingsDrawer>);

    expect(screen.getByTestId(`${dataTestid}-configuration-settings-drawer`)).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-settings-close`);
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Mocked Content')).toBeInTheDocument();
  });

  test('does not render component when closed', () => {
    renderWithProviders(
      <ItemSettingsDrawer {...props} open={false}>
        Mocked Content
      </ItemSettingsDrawer>,
    );

    expect(screen.queryByTestId(`${dataTestid}-configuration-settings-drawer`)).toBeNull();
    expect(screen.queryByTestId(`${dataTestid}-settings-close`)).toBeNull();
  });
});
