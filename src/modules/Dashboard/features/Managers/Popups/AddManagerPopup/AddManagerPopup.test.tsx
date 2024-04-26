import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { expectBanner } from 'shared/utils';
import * as MixpanelFunc from 'shared/utils/mixpanel';
import { initialStateData } from 'redux/modules';
import { Roles } from 'shared/consts';

import { AddManagerPopup } from './AddManagerPopup';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    workspacesRoles: initialStateData,
  },
};

const dataTestId = 'test-id';
const onCloseMock = jest.fn();

const props = {
  appletId: mockedAppletId,
  onClose: onCloseMock,
  popupVisible: true,
  'data-testid': dataTestId,
};

const mockWorkspaceInfo = {
  name: 'test-workspace',
  hasManagers: false,
};
const mockSubmitValues = {
  id: 'test-id',
  appletId: mockedAppletId,
  key: 'test-key',
  status: 'pending',
  userId: 'test-user-id',
  firstName: 'test-first-name',
  lastName: 'test-last-name',
  tag: null,
  email: 'test@email.com',
  role: 'manager',
  title: 'test-title',
};

describe('AddManagerPopup component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should submit the form and show success banner', async () => {
    const mixpanelTrack = jest.spyOn(MixpanelFunc.Mixpanel, 'track');
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: mockWorkspaceInfo,
      },
    });
    mockAxios.post.mockResolvedValueOnce({
      data: {
        result: mockSubmitValues,
      },
    });

    const { getByText, getByTestId, queryByTestId, store } = renderWithProviders(
      <AddManagerPopup {...props} />,
      { preloadedState },
    );

    expect(getByTestId(`${dataTestId}-add-manager-popup`)).toBeInTheDocument();

    const emailInput = getByTestId(`${dataTestId}-email`).querySelector('input');
    emailInput && (await userEvent.type(emailInput, mockSubmitValues.email));
    const firstNameInput = getByTestId(`${dataTestId}-fname`).querySelector('input');
    firstNameInput && (await userEvent.type(firstNameInput, mockSubmitValues.firstName));
    const lastNameInput = getByTestId(`${dataTestId}-lname`).querySelector('input');
    lastNameInput && (await userEvent.type(lastNameInput, mockSubmitValues.lastName));
    const titleInput = getByTestId(`${dataTestId}-title`).querySelector('input');
    titleInput && (await userEvent.type(titleInput, mockSubmitValues.title));
    const workspaceInput = getByTestId(`${dataTestId}-workspace`).querySelector('input');
    workspaceInput && (await userEvent.type(workspaceInput, 'test-workspace'));

    // Participants field should not be visible for manager role
    expect(queryByTestId(`${dataTestId}-participants`)).not.toBeInTheDocument();

    await userEvent.click(getByText('Send Invitation'));

    await waitFor(() => {
      expectBanner(store, 'AddParticipantSuccessBanner');
    });
    expect(mixpanelTrack).toBeCalledWith('Invitation sent successfully');
  });

  test('should omit workspace name field if it has managers', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: {
          ...mockWorkspaceInfo,
          hasManagers: true,
        },
      },
    });

    const { queryByTestId } = renderWithProviders(<AddManagerPopup {...props} />, {
      preloadedState,
    });

    await waitFor(() => {
      expect(queryByTestId(`${dataTestId}-workspace`)).toBeNull();
    });
  });

  test('should show the participants field if reviewer role is selected', async () => {
    const { getByTestId } = renderWithProviders(<AddManagerPopup {...props} />, {
      preloadedState,
    });

    const roleSelectButton = within(getByTestId(`${dataTestId}-role`)).getByRole('button');
    await userEvent.click(roleSelectButton);
    const roleOptions = await screen.findByRole('listbox', { name: 'Role' });
    await userEvent.click(within(roleOptions).getByText('Reviewer'));

    await waitFor(() => {
      expect(getByTestId(`${dataTestId}-participants`)).toBeInTheDocument();
    });
  });
});
