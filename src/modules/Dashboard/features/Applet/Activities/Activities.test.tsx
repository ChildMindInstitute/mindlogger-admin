import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios, { HttpResponse } from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';

import { ApiResponseCodes } from 'api';
import { page } from 'resources';
import { ParticipantTag, Roles } from 'shared/consts';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedEncryption,
  mockedOwnerId,
  mockedRespondent,
  mockedRespondent2,
  mockedUserData,
} from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockGetRequestResponses,
  mockSchema,
  mockSuccessfulHttpResponse,
} from 'shared/utils/axios-mocks';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { RespondentStatus } from 'modules/Dashboard/types';
import { ManagersData } from 'modules/Dashboard/features/Managers';
import {
  expectMixpanelTrack,
  openTakeNowModal,
  selectParticipant,
  selfReportCheckboxTestId,
  sourceSubjectDropdownTestId,
  takeNowModalTestId,
  toggleSelfReportCheckbox,
} from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.test-utils';

import { Activities } from './Activities';

const successfulEmptyGetAppletActivitiesMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: [],
      appletDetail: {
        ...mockedAppletData,
        activities: [],
      },
    },
  },
};

const successfulGetAppletActivitiesMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: mockedAppletData.activities,
      appletDetail: mockedAppletData,
    },
  },
};

const getAppletUrl = `/applets/${mockedAppletId}`;
const successfulGetAppletMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: { result: mockedAppletData },
};

const successfulEmptyHttpResponseMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
  },
};

const testId = 'dashboard-applet-activities';
const route = `/dashboard/${mockedAppletId}/activities`;
const routePath = page.appletActivities;

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('Dashboard > Applet > Activities screen', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
        enableMultiInformantTakeNow: true,
        enableParticipantMultiInformant: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render empty component', async () => {
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulEmptyGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });

    renderWithProviders(<Activities />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });
    await waitFor(() => {
      expect(screen.getByText('Applet has no activities')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    const getAppletActivitiesUrl = `/activities/applet/${mockedAppletId}`;

    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState: getPreloadedState() });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenCalledWith(getAppletActivitiesUrl, expect.any(Object));
      activities.forEach((activity) => expect(screen.getByText(activity)).toBeInTheDocument());
    });
  });

  test('click Add Activity should navigate to Builder > Applet > Activities', async () => {
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulEmptyGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState: getPreloadedState() });

    const addActivityLink = screen.getByTestId(`${testId}-add-activity`);
    expect(addActivityLink).toHaveAttribute(
      'href',
      generatePath(page.builderAppletActivities, { appletId: mockedAppletId }),
    );
  });

  describe('should show or hide edit ability depending on role', () => {
    test.each`
      canEdit  | role                 | description
      ${true}  | ${Roles.Manager}     | ${'editing for Manager'}
      ${true}  | ${Roles.SuperAdmin}  | ${'editing for SuperAdmin'}
      ${true}  | ${Roles.Owner}       | ${'editing for Owner'}
      ${false} | ${Roles.Coordinator} | ${'editing for Coordinator'}
      ${true}  | ${Roles.Editor}      | ${'editing for Editor'}
      ${false} | ${Roles.Respondent}  | ${'editing for Respondent'}
      ${false} | ${Roles.Reviewer}    | ${'editing for Reviewer'}
    `('$description', async ({ canEdit, role }) => {
      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
          successfulEmptyHttpResponseMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
          successfulEmptyHttpResponseMock,
      });
      renderWithProviders(<Activities />, {
        preloadedState: getPreloadedState(role),
        route,
        routePath,
      });

      const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
      if (actionDots && canEdit) {
        userEvent.click(actionDots);
        await waitFor(() => expect(screen.getByTestId(`${testId}-activity-edit`)).toBeVisible());

        fireEvent.click(screen.getByTestId(`${testId}-activity-edit`));
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(page.builderAppletActivity, {
            appletId: mockedAppletId,
            activityId: mockedAppletData.activities[0].id,
          }),
        );
      } else {
        await waitFor(() => expect(screen.queryByTestId(`${testId}-activity-edit`)).toBe(null));
      }
    });
  });

  describe('Take now modal', () => {
    describe('should show or hide Take Now button depending on role', () => {
      test.each`
        canDoTakeNow | role                 | description
        ${true}      | ${Roles.Manager}     | ${'Take Now for Manager'}
        ${true}      | ${Roles.SuperAdmin}  | ${'Take Now for SuperAdmin'}
        ${true}      | ${Roles.Owner}       | ${'Take Now for Owner'}
        ${false}     | ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${false}     | ${Roles.Editor}      | ${'Take Now for Editor'}
        ${false}     | ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${false}     | ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ canDoTakeNow, role }: { canDoTakeNow: boolean; role: Roles }) => {
        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
            successfulEmptyHttpResponseMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
            successfulEmptyHttpResponseMock,
        });
        renderWithProviders(<Activities />, {
          preloadedState: getPreloadedState(role),
          route,
          routePath,
        });

        const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];

        if (actionDots && canDoTakeNow) {
          userEvent.click(actionDots);
          await waitFor(() =>
            expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible(),
          );
        } else {
          await waitFor(() =>
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBe(null),
          );
        }
      });
    });

    describe('Should hide Take now button for everyone if feature flag is off', () => {
      test.each`
        role                 | description
        ${Roles.Manager}     | ${'Take Now for Manager'}
        ${Roles.SuperAdmin}  | ${'Take Now for SuperAdmin'}
        ${Roles.Owner}       | ${'Take Now for Owner'}
        ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${Roles.Editor}      | ${'Take Now for Editor'}
        ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ role }: { role: Roles }) => {
        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
            successfulEmptyHttpResponseMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
            successfulEmptyHttpResponseMock,
        });

        mockUseFeatureFlags.mockReturnValue({
          featureFlags: {
            enableMultiInformant: true,
            enableMultiInformantTakeNow: false,
            enableParticipantMultiInformant: false,
          },
          resetLDContext: jest.fn(),
        });

        renderWithProviders(<Activities />, {
          preloadedState: getPreloadedState(role),
          route,
          routePath,
        });

        const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
        if (actionDots) {
          await userEvent.click(actionDots);
          await waitFor(() =>
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBe(null),
          );
        }
      });
    });

    test('should pre-populate admin in Take Now modal and start assessment', async () => {
      const mockedOwnerRespondent = {
        id: mockedUserData.id,
        nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
        secretIds: ['mockedOwnerSecretId'],
        isAnonymousRespondent: false,
        lastSeen: new Date().toDateString(),
        isPinned: false,
        accessId: '912e17b8-195f-4685-b77b-137539b9054d',
        role: Roles.Owner,
        details: [
          {
            appletId: mockedApplet.id,
            appletDisplayName: mockedApplet.displayName,
            appletImage: '',
            accessId: '912e17b8-195f-4685-b77b-137539b9054d',
            respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
            respondentSecretId: 'mockedOwnerSecretId',
            hasIndividualSchedule: false,
            encryption: mockedApplet.encryption,
            subjectId: 'owner-subject-id-123',
            subjectTag: 'Team' as ParticipantTag,
            subjectFirstName: 'John',
            subjectLastName: 'Doe',
            subjectCreatedAt: '2023-09-26T12:11:46.162083',
            invitation: null,
          },
        ],
        status: RespondentStatus.Invited,
        email: mockedUserData.email,
      };

      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
        count: 3,
      });

      const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
        result: [
          {
            id: mockedOwnerRespondent.id,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            email: mockedOwnerRespondent.email,
            roles: [Roles.Owner],
            lastSeen: new Date().toDateString(),
            isPinned: mockedOwnerRespondent.isPinned,
            applets: [
              {
                id: mockedApplet.id,
                displayName: mockedApplet.displayName,
                image: '',
                roles: [
                  {
                    accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                    role: Roles.Owner,
                  },
                ],
                encryption: mockedEncryption,
              },
            ],
            title: null,
            createdAt: new Date().toISOString(),
            titles: [],
            status: 'approved',
            invitationKey: null,
          },
        ],
        count: 1,
      });

      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
          if (params.userId === mockedOwnerRespondent.id) {
            return mockSuccessfulHttpResponse<ParticipantsData>({
              result: [mockedOwnerRespondent],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
          successfulGetAppletManagersMock,
      });

      renderWithProviders(<Activities />, {
        preloadedState: {
          ...getPreloadedState(),
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await openTakeNowModal(testId);

      expectMixpanelTrack('Take Now click', { via: 'Applet - Activities' });

      const sourceInputElement = screen
        .getByTestId(sourceSubjectDropdownTestId(testId))
        .querySelector('input');

      expect(sourceInputElement).toHaveValue(
        `${mockedUserData.firstName} ${mockedUserData.lastName} (Team)`,
      );

      selectParticipant(testId, 'target', mockedRespondent.details[0].subjectId);

      expectMixpanelTrack('"Who are the responses about" dropdown opened');
      expectMixpanelTrack('"Who are the responses about" selection changed', {
        target_account_type: 'Full',
      });

      const submitButton = screen.getByTestId(`${takeNowModalTestId(testId)}-submit-button`);

      expect(submitButton).not.toBeDisabled();

      fireEvent.click(submitButton);

      expectMixpanelTrack('Multi-informant Start Activity click', {
        source_account_type: 'Team',
        target_account_type: 'Full',
        input_account_type: 'Team',
        is_self_reporting: true,
      });
    });

    test('Full account participants cannot self-report', async () => {
      const mockedOwnerRespondent = {
        id: mockedUserData.id,
        nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
        secretIds: ['mockedOwnerSecretId'],
        isAnonymousRespondent: false,
        lastSeen: new Date().toDateString(),
        isPinned: false,
        accessId: '912e17b8-195f-4685-b77b-137539b9054d',
        role: Roles.Owner,
        details: [
          {
            appletId: mockedApplet.id,
            appletDisplayName: mockedApplet.displayName,
            appletImage: '',
            accessId: '912e17b8-195f-4685-b77b-137539b9054d',
            respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
            respondentSecretId: 'mockedOwnerSecretId',
            hasIndividualSchedule: false,
            encryption: mockedApplet.encryption,
            subjectId: 'owner-subject-id-123',
            subjectTag: 'Team' as ParticipantTag,
            subjectFirstName: 'John',
            subjectLastName: 'Doe',
            subjectCreatedAt: '2023-09-26T12:11:46.162083',
            invitation: null,
          },
        ],
        status: RespondentStatus.Invited,
        email: mockedUserData.email,
      };

      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
        count: 3,
      });

      const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
        result: [
          {
            id: mockedOwnerRespondent.id,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            email: mockedOwnerRespondent.email,
            roles: [Roles.Owner],
            lastSeen: new Date().toDateString(),
            isPinned: mockedOwnerRespondent.isPinned,
            applets: [
              {
                id: mockedApplet.id,
                displayName: mockedApplet.displayName,
                image: '',
                roles: [
                  {
                    accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                    role: Roles.Owner,
                  },
                ],
                encryption: mockedEncryption,
              },
            ],
            title: null,
            createdAt: new Date().toISOString(),
            titles: [],
            status: 'approved',
            invitationKey: null,
          },
        ],
        count: 1,
      });

      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
          if (params.userId === mockedOwnerRespondent.id) {
            return mockSuccessfulHttpResponse<ParticipantsData>({
              result: [mockedOwnerRespondent],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
          successfulGetAppletManagersMock,
      });

      const { getByTestId } = renderWithProviders(<Activities />, {
        preloadedState: {
          ...getPreloadedState(),
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await openTakeNowModal(testId);

      selectParticipant(testId, 'source', mockedRespondent.details[0].subjectId);

      expectMixpanelTrack('"Who will be providing responses" dropdown opened');
      expectMixpanelTrack('"Who will be providing responses" selection changed', {
        source_account_type: 'Full',
      });

      const checkbox = getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

      expect(checkbox).toBeDisabled();
    });

    test('Full account participants are not present in the inputting dropdown', async () => {
      const mockedOwnerRespondent = {
        id: mockedUserData.id,
        nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
        secretIds: ['mockedOwnerSecretId'],
        isAnonymousRespondent: false,
        lastSeen: new Date().toDateString(),
        isPinned: false,
        accessId: '912e17b8-195f-4685-b77b-137539b9054d',
        role: Roles.Owner,
        details: [
          {
            appletId: mockedApplet.id,
            appletDisplayName: mockedApplet.displayName,
            appletImage: '',
            accessId: '912e17b8-195f-4685-b77b-137539b9054d',
            respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
            respondentSecretId: 'mockedOwnerSecretId',
            hasIndividualSchedule: false,
            encryption: mockedApplet.encryption,
            subjectId: 'owner-subject-id-123',
            subjectTag: 'Team' as ParticipantTag,
            subjectFirstName: 'John',
            subjectLastName: 'Doe',
            subjectCreatedAt: '2023-09-26T12:11:46.162083',
            invitation: null,
          },
        ],
        status: RespondentStatus.Invited,
        email: mockedUserData.email,
      };

      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
        count: 3,
      });

      const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
        result: [
          {
            id: mockedOwnerRespondent.id,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            email: mockedOwnerRespondent.email,
            roles: [Roles.Owner],
            lastSeen: new Date().toDateString(),
            isPinned: mockedOwnerRespondent.isPinned,
            applets: [
              {
                id: mockedApplet.id,
                displayName: mockedApplet.displayName,
                image: '',
                roles: [
                  {
                    accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                    role: Roles.Owner,
                  },
                ],
                encryption: mockedEncryption,
              },
            ],
            title: null,
            createdAt: new Date().toISOString(),
            titles: [],
            status: 'approved',
            invitationKey: null,
          },
        ],
        count: 1,
      });

      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
          if (params.userId === mockedOwnerRespondent.id) {
            return mockSuccessfulHttpResponse<ParticipantsData>({
              result: [mockedOwnerRespondent],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
          successfulGetAppletManagersMock,
      });

      const { getByTestId, getByRole } = renderWithProviders(<Activities />, {
        preloadedState: {
          ...getPreloadedState(),
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await openTakeNowModal(testId);

      await selectParticipant(testId, 'source', mockedOwnerRespondent.details[0].subjectId);

      expectMixpanelTrack('"Who will be providing responses" dropdown opened');
      expectMixpanelTrack('"Who will be providing responses" selection changed', {
        source_account_type: 'Team',
      });

      await toggleSelfReportCheckbox(testId);

      expectMixpanelTrack('Own responses checkbox toggled', {
        is_self_reporting: false,
      });

      const dropdownTestId = `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

      const inputElement = getByTestId(dropdownTestId).querySelector('input');

      if (inputElement === null) {
        throw new Error('Autocomplete logged-in user dropdown element not found');
      }

      fireEvent.mouseDown(inputElement);

      expectMixpanelTrack('"Who will be inputting the responses" dropdown opened');

      const options = within(getByRole('listbox')).queryAllByRole('option');

      expect(options.length).toBeGreaterThan(0);

      const dropdownOptionTestIdRegex = new RegExp(`^${dropdownTestId}-option-`);
      const optionsText = options.map(
        (option) =>
          option.getAttribute('data-testid')?.replace(dropdownOptionTestIdRegex, '') || '',
      );

      expect(optionsText).not.toContain(mockedRespondent.details[0].subjectId);
      expect(optionsText).not.toContain(mockedRespondent2.details[0].subjectId);

      selectParticipant(testId, 'loggedin', mockedOwnerRespondent.details[0].subjectId);

      expectMixpanelTrack('"Who will be inputting the responses" selection changed', {
        input_account_type: 'Team',
      });
    });

    describe('featureFlags.enableParticipantMultiInformant = true', () => {
      beforeEach(() => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: {
            enableMultiInformant: true,
            enableMultiInformantTakeNow: true,
            enableParticipantMultiInformant: true,
          },
          resetLDContext: jest.fn(),
        });
      });

      test('Full account participants can self-report', async () => {
        const mockedOwnerRespondent = {
          id: mockedUserData.id,
          nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
          secretIds: ['mockedOwnerSecretId'],
          isAnonymousRespondent: false,
          lastSeen: new Date().toDateString(),
          isPinned: false,
          accessId: '912e17b8-195f-4685-b77b-137539b9054d',
          role: Roles.Owner,
          details: [
            {
              appletId: mockedApplet.id,
              appletDisplayName: mockedApplet.displayName,
              appletImage: '',
              accessId: '912e17b8-195f-4685-b77b-137539b9054d',
              respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
              respondentSecretId: 'mockedOwnerSecretId',
              hasIndividualSchedule: false,
              encryption: mockedApplet.encryption,
              subjectId: 'owner-subject-id-123',
              subjectTag: 'Team' as ParticipantTag,
              subjectFirstName: 'John',
              subjectLastName: 'Doe',
              subjectCreatedAt: '2023-09-26T12:11:46.162083',
              invitation: null,
            },
          ],
          status: RespondentStatus.Invited,
          email: mockedUserData.email,
        };

        const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
          result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
          count: 3,
        });

        const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
          result: [
            {
              id: mockedOwnerRespondent.id,
              firstName: mockedUserData.firstName,
              lastName: mockedUserData.lastName,
              email: mockedOwnerRespondent.email,
              roles: [Roles.Owner],
              lastSeen: new Date().toDateString(),
              isPinned: mockedOwnerRespondent.isPinned,
              applets: [
                {
                  id: mockedApplet.id,
                  displayName: mockedApplet.displayName,
                  image: '',
                  roles: [
                    {
                      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                      role: Roles.Owner,
                    },
                  ],
                  encryption: mockedEncryption,
                },
              ],
              title: null,
              createdAt: new Date().toISOString(),
              titles: [],
              status: 'approved',
              invitationKey: null,
            },
          ],
          count: 1,
        });

        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
            if (params.userId === mockedOwnerRespondent.id) {
              return mockSuccessfulHttpResponse<ParticipantsData>({
                result: [mockedOwnerRespondent],
                count: 1,
              });
            }

            return successfulGetAppletParticipantsMock;
          },
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
            successfulGetAppletManagersMock,
        });

        const { getByTestId } = renderWithProviders(<Activities />, {
          preloadedState: {
            ...getPreloadedState(),
            auth: {
              authentication: mockSchema({
                user: mockedUserData,
              }),
              isAuthorized: true,
              isLogoutInProgress: false,
            },
          },
          route,
          routePath,
        });

        await openTakeNowModal(testId);

        await selectParticipant(testId, 'source', mockedOwnerRespondent.details[0].subjectId);

        expectMixpanelTrack('"Who will be providing responses" dropdown opened');
        expectMixpanelTrack('"Who will be providing responses" selection changed', {
          source_account_type: 'Team',
        });

        const checkbox = getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

        expect(checkbox).not.toBeDisabled();
      });

      test('Full account participants are present in the inputting dropdown', async () => {
        const mockedOwnerRespondent = {
          id: mockedUserData.id,
          nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
          secretIds: ['mockedOwnerSecretId'],
          isAnonymousRespondent: false,
          lastSeen: new Date().toDateString(),
          isPinned: false,
          accessId: '912e17b8-195f-4685-b77b-137539b9054d',
          role: Roles.Owner,
          details: [
            {
              appletId: mockedApplet.id,
              appletDisplayName: mockedApplet.displayName,
              appletImage: '',
              accessId: '912e17b8-195f-4685-b77b-137539b9054d',
              respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
              respondentSecretId: 'mockedOwnerSecretId',
              hasIndividualSchedule: false,
              encryption: mockedApplet.encryption,
              subjectId: 'owner-subject-id-123',
              subjectTag: 'Team' as ParticipantTag,
              subjectFirstName: 'John',
              subjectLastName: 'Doe',
              subjectCreatedAt: '2023-09-26T12:11:46.162083',
              invitation: null,
            },
          ],
          status: RespondentStatus.Invited,
          email: mockedUserData.email,
        };

        const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
          result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
          count: 3,
        });

        const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
          result: [
            {
              id: mockedOwnerRespondent.id,
              firstName: mockedUserData.firstName,
              lastName: mockedUserData.lastName,
              email: mockedOwnerRespondent.email,
              roles: [Roles.Owner],
              lastSeen: new Date().toDateString(),
              isPinned: mockedOwnerRespondent.isPinned,
              applets: [
                {
                  id: mockedApplet.id,
                  displayName: mockedApplet.displayName,
                  image: '',
                  roles: [
                    {
                      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                      role: Roles.Owner,
                    },
                  ],
                  encryption: mockedEncryption,
                },
              ],
              title: null,
              createdAt: new Date().toISOString(),
              titles: [],
              status: 'approved',
              invitationKey: null,
            },
          ],
          count: 1,
        });

        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
            if (params.userId === mockedOwnerRespondent.id) {
              return mockSuccessfulHttpResponse<ParticipantsData>({
                result: [mockedOwnerRespondent],
                count: 1,
              });
            }

            return successfulGetAppletParticipantsMock;
          },
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
            successfulGetAppletManagersMock,
        });

        const { getByTestId, getByRole } = renderWithProviders(<Activities />, {
          preloadedState: {
            ...getPreloadedState(),
            auth: {
              authentication: mockSchema({
                user: mockedUserData,
              }),
              isAuthorized: true,
              isLogoutInProgress: false,
            },
          },
          route,
          routePath,
        });

        await openTakeNowModal(testId);

        await selectParticipant(testId, 'source', mockedOwnerRespondent.details[0].subjectId);

        expectMixpanelTrack('"Who will be providing responses" dropdown opened');
        expectMixpanelTrack('"Who will be providing responses" selection changed', {
          source_account_type: 'Team',
        });

        await toggleSelfReportCheckbox(testId);

        expectMixpanelTrack('Own responses checkbox toggled', {
          is_self_reporting: false,
        });

        const dropdownTestId = `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

        const inputElement = getByTestId(dropdownTestId).querySelector('input');

        if (inputElement === null) {
          throw new Error('Autocomplete logged-in user dropdown element not found');
        }

        fireEvent.mouseDown(inputElement);

        expectMixpanelTrack('"Who will be inputting the responses" dropdown opened');

        const options = within(getByRole('listbox')).queryAllByRole('option');

        expect(options.length).toBeGreaterThan(0);

        const dropdownOptionTestIdRegex = new RegExp(`^${dropdownTestId}-option-`);
        const optionsText = options.map(
          (option) =>
            option.getAttribute('data-testid')?.replace(dropdownOptionTestIdRegex, '') || '',
        );

        expect(optionsText).toContain(mockedRespondent.details[0].subjectId);
        expect(optionsText).toContain(mockedRespondent2.details[0].subjectId);
      });

      test('should not pre-populate admin in Take Now modal', async () => {
        const mockedOwnerRespondent = {
          id: mockedUserData.id,
          nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
          secretIds: ['mockedOwnerSecretId'],
          isAnonymousRespondent: false,
          lastSeen: new Date().toDateString(),
          isPinned: false,
          accessId: '912e17b8-195f-4685-b77b-137539b9054d',
          role: Roles.Owner,
          details: [
            {
              appletId: mockedApplet.id,
              appletDisplayName: mockedApplet.displayName,
              appletImage: '',
              accessId: '912e17b8-195f-4685-b77b-137539b9054d',
              respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
              respondentSecretId: 'mockedOwnerSecretId',
              hasIndividualSchedule: false,
              encryption: mockedApplet.encryption,
              subjectId: 'owner-subject-id-123',
              subjectTag: 'Team' as ParticipantTag,
              subjectFirstName: 'John',
              subjectLastName: 'Doe',
              subjectCreatedAt: '2023-09-26T12:11:46.162083',
              invitation: null,
            },
          ],
          status: RespondentStatus.Invited,
          email: mockedUserData.email,
        };

        const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
          result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
          count: 3,
        });

        const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
          result: [
            {
              id: mockedOwnerRespondent.id,
              firstName: mockedUserData.firstName,
              lastName: mockedUserData.lastName,
              email: mockedOwnerRespondent.email,
              roles: [Roles.Owner],
              lastSeen: new Date().toDateString(),
              isPinned: mockedOwnerRespondent.isPinned,
              applets: [
                {
                  id: mockedApplet.id,
                  displayName: mockedApplet.displayName,
                  image: '',
                  roles: [
                    {
                      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                      role: Roles.Owner,
                    },
                  ],
                  encryption: mockedEncryption,
                },
              ],
              title: null,
              createdAt: new Date().toISOString(),
              titles: [],
              status: 'approved',
              invitationKey: null,
            },
          ],
          count: 1,
        });

        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
            if (params.userId === mockedOwnerRespondent.id) {
              return mockSuccessfulHttpResponse<ParticipantsData>({
                result: [mockedOwnerRespondent],
                count: 1,
              });
            }

            return successfulGetAppletParticipantsMock;
          },
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
            successfulGetAppletManagersMock,
        });

        renderWithProviders(<Activities />, {
          preloadedState: {
            ...getPreloadedState(),
            auth: {
              authentication: mockSchema({
                user: mockedUserData,
              }),
              isAuthorized: true,
              isLogoutInProgress: false,
            },
          },
          route,
          routePath,
        });

        await openTakeNowModal(testId);

        const inputElement = screen
          .getByTestId(`${sourceSubjectDropdownTestId(testId)}`)
          .querySelector('input');

        expect(inputElement).toHaveValue('');
      });
    });
  });
});
