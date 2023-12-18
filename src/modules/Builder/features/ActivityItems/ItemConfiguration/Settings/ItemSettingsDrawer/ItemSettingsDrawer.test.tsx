import { fireEvent } from '@testing-library/react';

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
    const { getByTestId, getByText } = renderWithProviders(
      <ItemSettingsDrawer {...props}>Mocked Content</ItemSettingsDrawer>,
    );

    expect(getByTestId(`${dataTestid}-configuration-settings-drawer`)).toBeInTheDocument();
    expect(getByText('Settings')).toBeInTheDocument();

    const closeButton = getByTestId(`${dataTestid}-settings-close`);
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(getByText('Mocked Content')).toBeInTheDocument();
  });

  test('does not render component when closed', () => {
    const { queryByTestId } = renderWithProviders(
      <ItemSettingsDrawer {...props} open={false}>
        Mocked Content
      </ItemSettingsDrawer>,
    );

    expect(queryByTestId(`${dataTestid}-configuration-settings-drawer`)).toBeNull();
    expect(queryByTestId(`${dataTestid}-settings-close`)).toBeNull();
  });
});
