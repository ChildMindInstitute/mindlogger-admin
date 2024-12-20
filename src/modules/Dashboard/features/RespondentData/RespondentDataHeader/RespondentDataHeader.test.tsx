import { fireEvent, screen } from '@testing-library/react';

import {
  mockedApplet,
  mockedAppletData,
  mockedFullParticipant1,
  mockedAppletId,
  mockedFullParticipantId1,
  mockedActivityId,
  mockedFullSubjectId1,
} from 'shared/mock';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Roles } from 'shared/consts';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { SubjectDetails } from 'modules/Dashboard/types';
import * as MixpanelFunc from 'shared/utils/mixpanel';
import { MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';

import { RespondentDataHeader } from './RespondentDataHeader';

const mockUseNavigate = jest.fn();
const mockedUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => mockedUseParams(),
}));

const dataTestid = 'respondent-data-header';

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

const mockedSubject: SubjectDetails = {
  nickname: mockedFullParticipant1.nicknames[0],
  secretUserId: mockedFullParticipant1.secretIds[0],
  userId: mockedFullParticipantId1,
  ...mockedFullParticipant1,
  id: mockedFullSubjectId1,
  firstName: 'John',
  lastName: 'Doe',
};

const mockedActivity = {
  ...mockedAppletData.activities[0],
  items: [],
  reportIncludedItemName: undefined,
};

const mockedActivityFlow = {
  ...mockedAppletData.activityFlows[0],
  activities: [mockedActivity],
};

const mixpanelTrack = jest.spyOn(MixpanelFunc.Mixpanel, 'track');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('RespondentDataHeader component tests', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableActivityAssign: true,
      },
      resetLDContext: jest.fn(),
    });
    mixpanelTrack.mockReset();
  });

  test('should render applet name', () => {
    mockedUseParams.mockReturnValue({});
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {},
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    expect(screen.getByText(mockedApplet.displayName)).toBeInTheDocument();
    expect(screen.getByText(mockedSubject.secretUserId)).toBeInTheDocument();
  });

  test.each`
    entity                | description
    ${mockedActivity}     | ${'should render activity name'}
    ${mockedActivityFlow} | ${'should render activity flow name'}
  `('$description', ({ entity }) => {
    mockedUseParams.mockReturnValue({ activityId: mockedActivity.id });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {},
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activityOrFlow={entity}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    expect(screen.getByText(entity.name)).toBeInTheDocument();
    expect(screen.getByText(mockedSubject.secretUserId)).toBeInTheDocument();
  });

  describe('should show or hide action buttons depending on role', () => {
    test.each`
      canViewData | role                 | description
      ${true}     | ${Roles.Manager}     | ${'editing for Manager'}
      ${true}     | ${Roles.SuperAdmin}  | ${'editing for SuperAdmin'}
      ${true}     | ${Roles.Owner}       | ${'editing for Owner'}
      ${false}    | ${Roles.Coordinator} | ${'editing for Coordinator'}
      ${false}    | ${Roles.Editor}      | ${'editing for Editor'}
      ${false}    | ${Roles.Respondent}  | ${'editing for Respondent'}
      ${true}     | ${Roles.Reviewer}    | ${'editing for Reviewer'}
    `('$description', async ({ canViewData, role }) => {
      renderWithProviders(
        <RespondentDataHeader
          dataTestid={dataTestid}
          applet={mockedApplet}
          subject={mockedSubject}
          activityOrFlow={mockedActivity}
        />,
        {
          preloadedState: getPreloadedState(role),
        },
      );
      const actionButton = screen.queryByTestId(`${dataTestid}-export-button`);
      canViewData ? expect(actionButton).toBeInTheDocument() : expect(actionButton).toBeNull();
    });
  });

  test('should hide assign activity button based feature flag', () => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableActivityAssign: false,
      },
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activityOrFlow={mockedActivity}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    expect(screen.queryByTestId(`${dataTestid}-assign-activity`)).toBeNull();
  });

  test('should trigger Mixpanel event when Assign toolbar button is clicked for activity', () => {
    mockedUseParams.mockReturnValue({ ...mockedUseParams(), activityId: mockedActivityId });
    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activityOrFlow={mockedActivity}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    fireEvent.click(screen.getByTestId(`${dataTestid}-assign-activity`));

    expect(mixpanelTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        action: MixpanelEventType.StartAssignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.ActivityId]: mockedActivityId,
        [MixpanelProps.EntityType]: 'activity',
        [MixpanelProps.Via]: 'Data Viz',
      }),
    );
  });

  test('should trigger Mixpanel event when Assign toolbar button is clicked for activity flow', () => {
    mockedUseParams.mockReturnValue({
      ...mockedUseParams(),
      activityFlowId: mockedActivityFlow.id,
    });

    const {
      reportIncludedItemName: _reportIncludedItemName,
      reportIncludedActivityName: _reportIncludedActivityName,
      ...mockFlow
    } = mockedActivityFlow;

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activityOrFlow={mockFlow}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    fireEvent.click(screen.getByTestId(`${dataTestid}-assign-activity`));

    expect(mixpanelTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        action: MixpanelEventType.StartAssignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.ActivityFlowId]: mockFlow.id,
        [MixpanelProps.EntityType]: 'flow',
        [MixpanelProps.Via]: 'Data Viz',
      }),
    );
  });

  describe('should show or hide take now button depending on role', () => {
    test.each`
      canPerformAction | role                 | description
      ${true}          | ${Roles.Manager}     | ${'editing for Manager'}
      ${true}          | ${Roles.SuperAdmin}  | ${'editing for SuperAdmin'}
      ${true}          | ${Roles.Owner}       | ${'editing for Owner'}
      ${false}         | ${Roles.Coordinator} | ${'editing for Coordinator'}
      ${false}         | ${Roles.Editor}      | ${'editing for Editor'}
      ${false}         | ${Roles.Respondent}  | ${'editing for Respondent'}
      ${false}         | ${Roles.Reviewer}    | ${'editing for Reviewer'}
    `('$description', async ({ canPerformAction, role }) => {
      renderWithProviders(
        <RespondentDataHeader
          dataTestid={dataTestid}
          applet={mockedApplet}
          subject={mockedSubject}
          activityOrFlow={mockedActivity}
        />,
        {
          preloadedState: getPreloadedState(role),
        },
      );
      const actionButton = screen.queryByTestId(`${dataTestid}-take-now`);
      canPerformAction ? expect(actionButton).toBeInTheDocument() : expect(actionButton).toBeNull();
    });
  });
});
