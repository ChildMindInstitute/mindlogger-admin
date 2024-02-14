import { screen, fireEvent, waitFor } from '@testing-library/react';

import { Roles } from 'shared/consts';
import { mockedManager, mockedApplet } from 'shared/mock';
import { renderWithProviders } from 'shared/utils';

import { Applet } from '.';

const mockApplet = {
  ...mockedApplet,
  roles: [{ role: Roles.Reviewer, reviewerRespondents: ['User1', 'User2'] }],
};

const addRoleMock = jest.fn();
const removeRoleMock = jest.fn();
const handleAddSelectedRespondentsMock = jest.fn();
const defaultRoles = mockedManager.applets[0].roles;

const renderComponent = (roles = defaultRoles) =>
  renderWithProviders(
    <Applet
      applet={{ ...mockApplet, roles }}
      addRole={addRoleMock}
      removeRole={removeRoleMock}
      handleAddSelectedRespondents={handleAddSelectedRespondentsMock}
      user={mockedManager}
      appletsWithoutRespondents={[]}
    />,
  );

describe('Applet', () => {
  test('calls addRole when a menu item is selected', () => {
    renderComponent();

    const addButton = screen.getByText('Add Role');
    fireEvent.click(addButton);
    const menuItem = screen.getByText('Editor');
    fireEvent.click(menuItem);
    expect(addRoleMock).toHaveBeenCalledWith(mockApplet.id, Roles.Editor);
  });

  test('opens SelectRespondentsPopup when edit respondents button is clicked', () => {
    renderComponent();

    const editButton = screen.getByTestId('dashboard-managers-edit-access-edit-role');
    fireEvent.click(editButton);
    expect(screen.getByTestId('dashboard-managers-select-respondents-popup')).toBeInTheDocument();
  });

  test('calls removeRole when a remove role button is clicked', () => {
    renderComponent();

    const removeButton = screen.getByTestId('chip-close-button');
    fireEvent.click(removeButton);
    expect(removeRoleMock).toHaveBeenCalledWith(mockApplet.id, Roles.Reviewer);
  });

  test('should render disabled Add Role button with tooltip when manager role', async () => {
    renderComponent([
      {
        role: Roles.Manager,
        accessId: 'accessId',
        reviewerRespondents: [],
      },
    ]);
    const addButton = screen.getByText('Add Role');
    expect(addButton).toBeDisabled();
    fireEvent.mouseOver(addButton);
    await waitFor(() => {
      expect(
        screen.queryByText('The user already has a Manager role with full access'),
      ).toBeInTheDocument();
    });
  });
});
