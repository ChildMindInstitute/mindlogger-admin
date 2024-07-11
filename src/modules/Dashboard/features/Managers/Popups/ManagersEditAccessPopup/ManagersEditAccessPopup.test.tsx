/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedOwnerId,
  mockedSubjectId1,
  mockedSubjectId2,
  mockedUserData,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import { Mixpanel, MixpanelProps, expectBanner } from 'shared/utils';

import { EditAccessPopup } from './ManagersEditAccessPopup';

const onCloseMock = jest.fn();
const mixpanelTrack = jest.spyOn(Mixpanel, 'track');

const user = {
  ...mockedUserData,
  roles: ['manager'],
  applets: [
    {
      id: mockedAppletId,
      displayName: 'Mock Applet',
      roles: [
        {
          accessId: '4110d991-4f14-439f-aa79-6f2db0830d62',
          role: 'manager',
          reviewerSubjects: [],
        },
      ],
    },
  ],
};
const dataTestid = 'dashboard-managers-edit';
const route = `/dashboard/${mockedAppletId}/managers`;
const routePath = page.appletManagers;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...mockedCurrentWorkspace,
    },
    roles: {
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
  },
  users: {
    allRespondents: {
      data: {
        result: [
          {
            id: '429fe361-478b-49f0-b681-d476eaec5c52',
            nicknames: ['John Doe'],
            secretIds: ['66947648-8eea-4106-9081-4b66117ef2e6'],
            isAnonymousRespondent: false,
            details: [
              {
                appletId: mockedAppletId,
                appletDisplayName: 'Mock Applet',
                accessId: 'f49a8aa2-bc9c-46cc-a9b5-03f191d908a2',
                respondentNickname: 'John Doe',
                respondentSecretId: '66947648-8eea-4106-9081-4b66117ef2e6',
                subjectId: mockedSubjectId1,
              },
            ],
          },
          {
            id: 'c48b275d-db4b-4f79-8469-9198b45985d3',
            nicknames: ['Sam Carter'],
            secretIds: ['78ec50c9-cac8-46fe-9232-352c4c561a33'],
            isAnonymousRespondent: false,
            details: [
              {
                appletId: mockedAppletId,
                appletDisplayName: 'Mock Applet',
                accessId: '71d4840d-ab38-4b88-a65e-417918d8d329',
                respondentNickname: 'Sam Carter',
                respondentSecretId: '78ec50c9-cac8-46fe-9232-352c4c561a33',
                subjectId: mockedSubjectId2,
              },
            ],
          },
        ],
      },
    },
  },
};

describe('EditAccessPopup component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders modal with correct content', () => {
    renderWithProviders(<EditAccessPopup user={user} popupVisible onClose={onCloseMock} />, {
      preloadedState,
      route,
      routePath,
    });

    expect(screen.getByTestId(`${dataTestid}-access-popup`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-access-popup-title`)).toBeInTheDocument();
    expect(screen.getByText('Edit Access')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    renderWithProviders(<EditAccessPopup user={user} popupVisible onClose={onCloseMock} />, {
      preloadedState,
      route,
      routePath,
    });

    const closeButton = screen.getByTestId(`${dataTestid}-access-popup-close-button`);
    await userEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('submits form when save button is clicked', async () => {
    mockAxios.delete.mockResolvedValueOnce({
      data: null,
    });
    mockAxios.post.mockResolvedValueOnce({
      data: null,
    });

    const { store } = renderWithProviders(
      <EditAccessPopup user={user} popupVisible onClose={onCloseMock} />,
      {
        preloadedState,
        route,
        routePath,
      },
    );

    const saveButton = screen.getByTestId(`${dataTestid}-access-popup-submit-button`);
    await userEvent.click(saveButton);

    expect(mixpanelTrack).toBeCalledWith('Edit Team Member form submitted', {
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Roles]: user.roles,
    });

    expect(mockAxios.delete).toBeCalledWith('/workspaces/managers/removeAccess', {
      data: {
        appletIds: ['2e46fa32-ea7c-4a76-b49b-1c97d795bb9a'],
        userId: mockedUserData.id,
      },
      signal: undefined,
    });

    expect(mockAxios.post).toBeCalledWith(
      `/workspaces/${mockedOwnerId}/managers/${mockedUserData.id}/accesses`,
      {
        accesses: [
          {
            appletId: '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a',
            subjects: [],
            roles: ['manager'],
          },
        ],
      },
      { signal: undefined },
    );

    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    expect(mixpanelTrack).toBeCalledWith('Team Member edited successfully', {
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Roles]: user.roles,
    });
  });

  test('changes the role to reviewer', async () => {
    mockAxios.delete.mockResolvedValueOnce({
      data: null,
    });
    mockAxios.post.mockResolvedValueOnce({
      data: null,
    });

    const { store } = renderWithProviders(
      <EditAccessPopup user={user} popupVisible onClose={onCloseMock} />,
      {
        preloadedState,
        route,
        routePath,
      },
    );

    const removeRoleButton = screen.getByTestId('chip-close-button');
    await userEvent.click(removeRoleButton);

    const addRoleButton = screen.getByTestId(`${dataTestid}-add-role`);
    await userEvent.click(addRoleButton);

    const menu = screen.getByTestId(`${dataTestid}-add-role-menu`);
    expect(menu).toBeInTheDocument();
    const reviewerLi = within(menu).getByText('Reviewer');
    expect(reviewerLi).toBeInTheDocument();
    await userEvent.click(reviewerLi);

    // trying to save without respondents
    const saveButton = screen.getByTestId(`${dataTestid}-access-popup-submit-button`);
    await userEvent.click(saveButton);
    expect(
      screen.getByText(
        'Please add access to review the Data of at least one Respondent in the Mock Applet for the Reviewer role or remove the role.',
      ),
    ).toBeInTheDocument();

    mockAxios.get.mockResolvedValue(preloadedState.users.allRespondents);

    const editRole = screen.getByTestId(`${dataTestid}-access-edit-role`);
    expect(editRole).toBeInTheDocument();
    expect(editRole).toHaveTextContent('Edit Respondents');
    await userEvent.click(editRole);

    const selectRespondentsPopup = screen.getByTestId(
      'dashboard-managers-select-respondents-popup',
    );
    expect(selectRespondentsPopup).toBeInTheDocument();

    const allCheckbox = selectRespondentsPopup.querySelector('thead input');
    allCheckbox && (await userEvent.click(allCheckbox));
    expect(screen.getByText('2 Respondents selected')).toBeInTheDocument();

    const selectRespondentsSaveButton = screen.getByTestId(
      'dashboard-managers-select-respondents-popup-submit-button',
    );
    await userEvent.click(selectRespondentsSaveButton);

    await userEvent.click(saveButton);

    expect(mixpanelTrack).toBeCalledWith('Edit Team Member form submitted', {
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Roles]: [Roles.Reviewer],
    });

    expect(mockAxios.delete).toBeCalledWith('/workspaces/managers/removeAccess', {
      data: {
        appletIds: ['2e46fa32-ea7c-4a76-b49b-1c97d795bb9a'],
        userId: mockedUserData.id,
      },
      signal: undefined,
    });

    expect(mockAxios.post).toBeCalledWith(
      `/workspaces/${mockedOwnerId}/managers/${mockedUserData.id}/accesses`,
      {
        accesses: [
          {
            appletId: '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a',
            subjects: ['subject-id-987', 'subject-id-123'],
            roles: ['reviewer'],
          },
        ],
      },
      { signal: undefined },
    );

    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    expect(mixpanelTrack).toBeCalledWith('Team Member edited successfully', {
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Roles]: [Roles.Reviewer],
    });
  });
});
