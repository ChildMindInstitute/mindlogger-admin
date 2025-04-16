import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import {
  mockedActivityId,
  mockedAppletData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedLimitedParticipant,
  mockedOwnerSubject,
  mockedFullParticipant1,
} from 'shared/mock';
import { mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { Activity, initialStateData } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { AssignedActivity, HydratedAssignment } from 'api';
import { expectBanner, MixpanelEventType, MixpanelProps } from 'shared/utils';
import * as MixpanelFunc from 'shared/utils/mixpanel';

import { ActivityUnassignDrawer } from './ActivityUnassignDrawer';
import { checkAssignment } from './ActivityUnassignDrawer.test-utils';
import { ActivityUnassignDrawerProps } from './ActivityUnassignDrawer.types';

/* Mock data
=================================================== */

const dataTestId = 'applet-activity-unassign';
const mockedOnClose = vi.fn();

const mockedAssignment1: HydratedAssignment = {
  id: 'test-assignment-id-1',
  activityId: mockedAppletData.activities[0].id as string,
  activityFlowId: null,
  respondentSubject: mockedOwnerSubject,
  targetSubject: {
    id: mockedLimitedParticipant.details[0].subjectId,
    nickname: mockedLimitedParticipant.nicknames[0],
    tag: mockedLimitedParticipant.details[0].subjectTag,
    secretUserId: mockedLimitedParticipant.secretIds[0],
    lastSeen: mockedLimitedParticipant.lastSeen,
    userId: null,
    firstName: mockedLimitedParticipant.details[0].subjectFirstName,
    lastName: mockedLimitedParticipant.details[0].subjectLastName,
  },
};

const mockedAssignment2 = {
  id: 'test-assignment-id-2',
  activityId: mockedAppletData.activities[0].id as string,
  activityFlowId: null,
  respondentSubject: mockedOwnerSubject,
  targetSubject: {
    id: mockedFullParticipant1.details[0].subjectId,
    nickname: mockedFullParticipant1.nicknames[0],
    tag: mockedFullParticipant1.details[0].subjectTag,
    secretUserId: mockedFullParticipant1.secretIds[0],
    lastSeen: mockedFullParticipant1.lastSeen,
    userId: null,
    firstName: mockedFullParticipant1.details[0].subjectFirstName,
    lastName: mockedFullParticipant1.details[0].subjectLastName,
  },
};

const mockedActivity: AssignedActivity = {
  ...(mockedAppletData.activities[0] as unknown as Activity),
  assignments: [mockedAssignment1, mockedAssignment2],
};

const props: ActivityUnassignDrawerProps = {
  appletId: mockedAppletId,
  activityOrFlow: mockedActivity,
  open: true,
  onClose: mockedOnClose,
};

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: initialStateData,
    workspacesRoles: initialStateData,
  },
};

const APPLET_ASSIGNMENTS_URL = `/assignments/applet/${mockedAppletId}`;

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

const mixpanelTrack = vi.spyOn(MixpanelFunc.Mixpanel, 'track');

/* Tests
=================================================== */

describe('ActivityUnassignDrawer', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableActivityAssign: true },
      resetLDContext: vi.fn(),
    });

    mockAxios.delete.mockResolvedValue(mockSuccessfulHttpResponse(null));
    mixpanelTrack.mockReset();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when there are multiple assignments', () => {
    it('renders drawer', () => {
      renderWithProviders(<ActivityUnassignDrawer {...props} />, { preloadedState });

      expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
      expect(screen.getByText('Unassign Activity')).toBeInTheDocument();
    });

    it('calls onClose when closed', () => {
      renderWithProviders(<ActivityUnassignDrawer {...props} />, { preloadedState });

      fireEvent.click(screen.getByLabelText('Close'));

      expect(mockedOnClose).toHaveBeenCalled();
    });

    it('renders activity or flow in the header', async () => {
      renderWithProviders(<ActivityUnassignDrawer {...props} />, { preloadedState });

      const drawer = screen.getByTestId(dataTestId);
      expect(within(drawer).getByText(mockedActivity.name)).toBeInTheDocument();
    });

    it('populates assignments list when there are multiple assignments', async () => {
      renderWithProviders(<ActivityUnassignDrawer {...props} />, { preloadedState });

      checkAssignment(mockedAssignment1.respondentSubject, mockedAssignment1.targetSubject, 0);
      checkAssignment(mockedAssignment2.respondentSubject, mockedAssignment2.targetSubject, 1);
    });

    it('prevents proceeding if no assignments are selected', async () => {
      renderWithProviders(<ActivityUnassignDrawer {...props} />, { preloadedState });

      expect(screen.getByText('Unassign')).toBeDisabled();
    });

    it('successfully deletes assignment via the API', async () => {
      const { store } = renderWithProviders(<ActivityUnassignDrawer {...props} />, {
        preloadedState,
      });

      fireEvent.click(
        within(
          screen.getByTestId(`${dataTestId}-assignments-table-checkbox-${mockedAssignment2.id}`),
        ).getByRole('checkbox'),
      );

      await waitFor(() => {
        expect(screen.getByText('Unassign')).toBeEnabled();
      });

      fireEvent.click(screen.getByText('Unassign'));

      await waitFor(() => {
        expect(screen.getByTestId(`${dataTestId}-confirmation-popup`)).toBeInTheDocument();
        expect(screen.getByText(`Unassign ‘${mockedActivity.name}’`)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId(`${dataTestId}-confirmation-popup-submit-button`));

      await waitFor(() => {
        expectBanner(store, 'SaveSuccessBanner');

        expect(mixpanelTrack).toHaveBeenCalledWith(
          expect.objectContaining({
            action: MixpanelEventType.ConfirmUnassignActivityOrFlow,
            [MixpanelProps.AppletId]: mockedAppletId,
            [MixpanelProps.AssignmentCount]: 1,
            [MixpanelProps.SelfReportAssignmentCount]: 0,
            [MixpanelProps.MultiInformantAssignmentCount]: 1,
            [MixpanelProps.EntityType]: 'activity',
            [MixpanelProps.ActivityId]: mockedActivityId,
          }),
        );

        expect(mockAxios.delete).toBeCalledWith(APPLET_ASSIGNMENTS_URL, {
          data: {
            assignments: [
              {
                activity_id: mockedAssignment2.activityId,
                activity_flow_id: mockedAssignment2.activityFlowId,
                respondent_subject_id: mockedAssignment2.respondentSubject.id,
                target_subject_id: mockedAssignment2.targetSubject.id,
              },
            ],
          },
        });
      });
    });
  });

  describe('when there is only one assignment', () => {
    const oneAssignmentProps = {
      ...props,
      activityOrFlow: { ...mockedActivity, assignments: [mockedAssignment1] },
    };

    it('renders popup', () => {
      renderWithProviders(<ActivityUnassignDrawer {...oneAssignmentProps} />, { preloadedState });

      expect(screen.getByTestId(`${dataTestId}-confirmation-popup`)).toBeInTheDocument();
      expect(screen.getByText(`Unassign ‘${mockedActivity.name}’`)).toBeInTheDocument();
    });

    it('calls onClose when closed', () => {
      renderWithProviders(<ActivityUnassignDrawer {...oneAssignmentProps} />, { preloadedState });

      fireEvent.click(screen.getByTestId(`${dataTestId}-confirmation-popup-close-button`));

      expect(mockedOnClose).toHaveBeenCalled();
    });

    it('successfully deletes assignment via the API', async () => {
      const { store } = renderWithProviders(<ActivityUnassignDrawer {...oneAssignmentProps} />, {
        preloadedState,
      });

      expect(screen.getByTestId(`${dataTestId}-confirmation-popup`)).toBeInTheDocument();
      expect(screen.getByText(`Unassign ‘${mockedActivity.name}’`)).toBeInTheDocument();

      fireEvent.click(screen.getByText('Unassign'));

      await waitFor(() => {
        expectBanner(store, 'SaveSuccessBanner');

        expect(mixpanelTrack).toHaveBeenCalledWith(
          expect.objectContaining({
            action: MixpanelEventType.ConfirmUnassignActivityOrFlow,
            [MixpanelProps.AppletId]: mockedAppletId,
            [MixpanelProps.AssignmentCount]: 1,
            [MixpanelProps.SelfReportAssignmentCount]: 0,
            [MixpanelProps.MultiInformantAssignmentCount]: 1,
            [MixpanelProps.EntityType]: 'activity',
            [MixpanelProps.ActivityId]: mockedActivityId,
          }),
        );

        expect(mockAxios.delete).toBeCalledWith(APPLET_ASSIGNMENTS_URL, {
          data: {
            assignments: [
              {
                activity_id: mockedAssignment1.activityId,
                activity_flow_id: mockedAssignment1.activityFlowId,
                respondent_subject_id: mockedAssignment1.respondentSubject.id,
                target_subject_id: mockedAssignment1.targetSubject.id,
              },
            ],
          },
        });
      });
    });
  });
});
