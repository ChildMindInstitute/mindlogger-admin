import { screen } from '@testing-library/react';

import {
  mockedApplet,
  mockedAppletData,
  mockedRespondent,
  mockedAppletId,
  mockedRespondentId,
} from 'shared/mock';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Roles } from 'shared/consts';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { RespondentDetails } from 'modules/Dashboard/types';

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

const mockUseFeatureFlags = useFeatureFlags as jest.Mock;

const mockedSubject: RespondentDetails = {
  nickname: mockedRespondent.nicknames[0],
  secretUserId: mockedRespondent.secretIds[0],
  userId: mockedRespondentId,
  ...mockedRespondent,
};

const mockedActivity = {
  ...mockedAppletData.activities[0],
  items: [],
  reportIncludedItemName: undefined,
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('RespondentDataHeader component tests', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableMultiInformantTakeNow: true,
        enableActivityAssign: true,
      },
    });
  });

  test('should render applet name', () => {
    mockedUseParams.mockReturnValue({});
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {},
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

  test('should render activity name', () => {
    mockedUseParams.mockReturnValue({ activityId: mockedActivity.id });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {},
    });

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activity={mockedActivity}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    expect(screen.getByText(mockedActivity.name)).toBeInTheDocument();
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
          activity={mockedActivity}
        />,
        {
          preloadedState: getPreloadedState(role),
        },
      );
      const actionButton = screen.queryByTestId(`${dataTestid}-export-button`);
      canViewData ? expect(actionButton).toBeInTheDocument() : expect(actionButton).toBeNull();
    });
  });

  test('should hide take now button based feature flag', () => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableMultiInformantTakeNow: false,
      },
    });

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activity={mockedActivity}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    expect(screen.queryByTestId(`${dataTestid}-take-now`)).toBeNull();
  });

  test('should hide assign activity button based feature flag', () => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableActivityAssign: false,
      },
    });

    renderWithProviders(
      <RespondentDataHeader
        dataTestid={dataTestid}
        applet={mockedApplet}
        subject={mockedSubject}
        activity={mockedActivity}
      />,
      {
        preloadedState: getPreloadedState(Roles.SuperAdmin),
      },
    );

    expect(screen.queryByTestId(`${dataTestid}-assign-activity`)).toBeNull();
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
      ${true}          | ${Roles.Reviewer}    | ${'editing for Reviewer'}
    `('$description', async ({ canPerformAction, role }) => {
      renderWithProviders(
        <RespondentDataHeader
          dataTestid={dataTestid}
          applet={mockedApplet}
          subject={mockedSubject}
          activity={mockedActivity}
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
