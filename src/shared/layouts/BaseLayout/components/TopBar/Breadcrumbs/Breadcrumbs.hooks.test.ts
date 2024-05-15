/* eslint-disable quotes */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { page } from 'resources';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { useBreadcrumbs } from './Breadcrumbs.hooks';

const appletId = '71d90215-e4ae-41c5-8c30-776e69f5378b';
const activityId = 'd65e8a64-a023-4830-9c84-7433c4b96440';
const activityFlowId = '18637282-e179-4c05-9a8e-b1cbe592bccb';
const participantId = '62c234e3-ef32-43a7-9cc1-5b0c67a9f6ca';

const preloadedState = {
  workspaces: {
    currentWorkspace: {
      data: {
        workspaceName: 'WorkspaceName',
      },
    },
  },
};

const commonDatavizState = {
  applet: {
    applet: {
      data: {
        result: {
          displayName: 'Mocked Applet',
        },
      },
    },
  },
  users: {
    subjectDetails: {
      data: {
        result: {
          nickname: 'Jane Doe',
          secretUserId: 'secretUserId',
        },
      },
    },
    respondentDetails: {
      data: null,
    },
  },
};

const commonExpectedFirstBreadcrumb = {
  label: "WorkspaceName's Dashboard",
  navPath: '/dashboard',
  key: expect.any(String),
};

const expectedHome = {
  icon: 'home',
  ...commonExpectedFirstBreadcrumb,
};

const expectedDashboard = {
  icon: 'dashboard',
  ...commonExpectedFirstBreadcrumb,
};

const expectedApplet = {
  image: '',
  useCustomIcon: true,
  label: '',
  chip: 'Editing',
  navPath: `/builder/${appletId}`,
  key: expect.any(String),
};
const expectedActivities = {
  icon: 'checklist-outlined',
  label: 'Activities',
  navPath: `/builder/${appletId}/activities`,
  key: expect.any(String),
};

const expectedNewActivity = {
  icon: 'checklist-outlined',
  label: 'New Activity',
  navPath: `/builder/${appletId}/activities/${activityId}`,
  key: expect.any(String),
};

const expectedActivityFlows = {
  icon: 'flow',
  label: 'Activity Flows',
  navPath: `/builder/${appletId}/activity-flows`,
  key: expect.any(String),
};

const expectedNewActivityFlow = {
  label: 'New Activity Flow',
  navPath: `/builder/${appletId}/activity-flows/${activityFlowId}`,
  key: expect.any(String),
};

const commonDataVizTest = ({ home, applet, user, viewData }) => {
  expect(home).toEqual(expectedHome);
  expect(applet).toEqual({
    ...expectedApplet,
    label: 'Mocked Applet',
    navPath: `/dashboard/${appletId}/participants`,
    chip: undefined,
  });
  expect(user).toEqual({
    icon: undefined,
    label: 'Respondent: secretUserId (Jane Doe)',
    disabledLink: true,
    key: expect.any(String),
    navPath: undefined,
  });
  expect(viewData).toEqual({
    label: 'View Data',
    disabledLink: true,
    key: expect.any(String),
  });
};

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: jest.fn(),
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  ...jest.requireActual('shared/hooks/useFeatureFlags'),
  useFeatureFlags: jest.fn(),
}));

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableMultiInformant: false,
      },
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should generate correct breadcrumbs for dashboard (applets tab)', () => {
    const route = '/dashboard/applets';
    const routePath = page.dashboardApplets;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(2);
    const [home, applets] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applets).toEqual({
      icon: 'applet-outlined',
      label: 'Applets',
      navPath: '/dashboard/applets',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for library', () => {
    const route = '/library';
    const routePath = page.library;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
    });

    expect(result.current).toHaveLength(1);
    const [library] = result.current;

    expect(library).toEqual({
      icon: 'library',
      label: 'Applet library',
      navPath: '/library',
      key: expect.any(String),
    });
  });
  test('should generate correct breadcrumbs for library/cart', () => {
    const route = '/library/cart';
    const routePath = page.libraryCart;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
    });

    expect(result.current).toHaveLength(2);
    const [library, cart] = result.current;

    expect(library).toEqual({
      icon: 'library',
      label: 'Applet library',
      navPath: '/library',
      key: expect.any(String),
    });
    expect(cart).toEqual({
      icon: 'cart-outlined',
      label: 'Cart',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for applet (add user)', () => {
    const route = `/dashboard/${appletId}/add-user`;
    const routePath = page.appletAddUser;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(3);
    const [home, applet, addUser] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applet).toEqual({
      ...expectedApplet,
      navPath: `/dashboard/${appletId}/respondents`,
      chip: undefined,
    });
    expect(addUser).toEqual({
      disabledLink: true,
      icon: 'users-outlined',
      label: 'Add User',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for applet (schedule)', () => {
    const route = `/dashboard/${appletId}/schedule`;
    const routePath = page.appletSchedule;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(3);
    const [home, applet, schedule] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applet).toEqual({
      ...expectedApplet,
      navPath: `/dashboard/${appletId}/respondents`,
      chip: undefined,
    });
    expect(schedule).toEqual({
      disabledLink: true,
      icon: 'schedule-outlined',
      label: 'Schedule',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for applet dataviz/summary', () => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
      },
    });

    const route = `/dashboard/${appletId}/participants/${participantId}/dataviz/summary`;
    const routePath = page.appletParticipantDataSummary;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState: {
        ...preloadedState,
        ...commonDatavizState,
      },
    });

    expect(result.current).toHaveLength(4);
    const [home, applet, user, viewData] = result.current;

    commonDataVizTest({ home, applet, user, viewData });
  });

  test('should generate correct breadcrumbs for applet dataviz/responses', () => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
      },
    });

    const route = `/dashboard/${appletId}/participants/${participantId}/dataviz/responses`;
    const routePath = page.appletParticipantDataReview;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState: {
        ...preloadedState,
        ...commonDatavizState,
      },
    });

    expect(result.current).toHaveLength(4);
    const [home, applet, user, viewData] = result.current;

    commonDataVizTest({ home, applet, user, viewData });
  });

  test('should generate correct breadcrumbs for applet settings (export data)', () => {
    const route = `/dashboard/${appletId}/settings/export-data`;
    const routePath = page.appletSettingsItem;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(4);
    const [home, applet, appletSettings, exportData] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applet).toEqual({
      ...expectedApplet,
      navPath: `/dashboard/${appletId}/respondents`,
      chip: undefined,
    });
    expect(appletSettings).toEqual({
      icon: 'settings',
      label: 'Applet Settings',
      navPath: `/dashboard/${appletId}/settings`,
      key: expect.any(String),
    });
    expect(exportData).toEqual({
      icon: 'export',
      label: 'Export Data',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activities', () => {
    const route = `/builder/${appletId}/activities`;
    const routePath = page.builderAppletActivities;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(3);
    const [dashboard, applet, activities] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activities).toEqual({
      icon: 'checklist-filled',
      label: 'Activities',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity about', () => {
    const route = `/builder/${appletId}/activities/${activityId}/about`;
    const routePath = page.builderAppletActivityAbout;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(5);
    const [dashboard, applet, activities, newActivity, activityAbout] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activities).toEqual(expectedActivities);
    expect(newActivity).toEqual(expectedNewActivity);
    expect(activityAbout).toEqual({
      icon: 'more-info-outlined',
      label: 'About Activity',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity settings', () => {
    const route = `/builder/${appletId}/activities/${activityId}/settings`;
    const routePath = page.builderAppletActivitySettings;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(5);
    const [dashboard, applet, activities, newActivity, activitySettings] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activities).toEqual(expectedActivities);
    expect(newActivity).toEqual(expectedNewActivity);
    expect(activitySettings).toEqual({
      icon: 'settings',
      label: 'Activity Settings',
      navPath: `/builder/${appletId}/activities/${activityId}/settings`,
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity performance task (touch)', () => {
    const route = `/builder/${appletId}/activities/performance-task/touch/${activityId}`;
    const routePath = page.builderAppletTouch;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(5);
    const [dashboard, applet, activities, touch, configure] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activities).toEqual(expectedActivities);
    expect(touch).toEqual({
      label: 'touch',
      disabledLink: true,
      key: expect.any(String),
    });
    expect(configure).toEqual({
      icon: 'configure',
      label: 'Configure',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity flows', () => {
    const route = `/builder/${appletId}/activity-flows`;
    const routePath = page.builderAppletActivityFlow;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(3);
    const [dashboard, applet, activityFlows] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activityFlows).toEqual({
      icon: 'flow',
      label: 'Activity Flows',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity flow about', () => {
    const route = `/builder/${appletId}/activity-flows/${activityFlowId}/about`;
    const routePath = page.builderAppletActivityFlowItemAbout;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(5);
    const [dashboard, applet, activityFlows, newActivityFlow, activityFlowAbout] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activityFlows).toEqual(expectedActivityFlows);
    expect(newActivityFlow).toEqual(expectedNewActivityFlow);
    expect(activityFlowAbout).toEqual({
      icon: 'more-info-outlined',
      label: 'About Activity Flow',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity flow builder', () => {
    const route = `/builder/${appletId}/activity-flows/${activityFlowId}/builder`;
    const routePath = page.builderAppletActivityFlowItemBuilder;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(5);
    const [dashboard, applet, activityFlows, newActivityFlow, activityFlowBuilder] = result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activityFlows).toEqual(expectedActivityFlows);
    expect(newActivityFlow).toEqual(expectedNewActivityFlow);
    expect(activityFlowBuilder).toEqual({
      icon: 'flow',
      label: 'Activity Flow Builder',
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for builder activity flow settings', () => {
    const route = `/builder/${appletId}/activity-flows/${activityFlowId}/settings`;
    const routePath = page.builderAppletActivityFlowItemSettings;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState,
    });

    expect(result.current).toHaveLength(5);
    const [dashboard, applet, activityFlows, newActivityFlow, activityFlowSettings] =
      result.current;

    expect(dashboard).toEqual(expectedDashboard);
    expect(applet).toEqual(expectedApplet);
    expect(activityFlows).toEqual(expectedActivityFlows);
    expect(newActivityFlow).toEqual(expectedNewActivityFlow);
    expect(activityFlowSettings).toEqual({
      icon: 'settings',
      label: 'Activity Flow Settings',
      navPath: `/builder/${appletId}/activity-flows/${activityFlowId}/settings`,
      key: expect.any(String),
    });
  });

  test('should generate correct breadcrumbs for participant details using multi-informant', () => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
      },
    });
    const route = `/dashboard/${appletId}/participants/${participantId}`;
    const routePath = page.appletParticipantActivities;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState: {
        ...preloadedState,
        applet: {
          applet: {
            data: {
              result: {
                displayName: 'Mocked Applet',
              },
            },
          },
        },
        users: {
          subjectDetails: {
            data: null,
          },
          respondentDetails: {
            data: {
              result: {
                nickname: 'Jane Doe',
                secretUserId: 'secretUserId',
              },
            },
          },
        },
      },
    });

    expect(result.current).toHaveLength(3);

    const [home, applet, participant] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applet).toEqual({
      chip: undefined,
      image: '',
      key: expect.any(String),
      label: 'Mocked Applet',
      navPath: '/dashboard/71d90215-e4ae-41c5-8c30-776e69f5378b/participants',
      useCustomIcon: true,
    });
    expect(participant).toEqual({
      disabledLink: true,
      icon: undefined,
      key: expect.any(String),
      label: 'secretUserId',
    });
  });

  test('should generate correct breadcrumbs for participant details schedule using multi-informant', () => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
      },
    });
    const route = `/dashboard/${appletId}/participants/${participantId}/schedule`;
    const routePath = page.appletParticipantSchedule;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState: {
        ...preloadedState,
        applet: {
          applet: {
            data: {
              result: {
                displayName: 'Mocked Applet',
              },
            },
          },
        },
        users: {
          subjectDetails: {
            data: null,
          },
          respondentDetails: {
            data: {
              result: {
                nickname: 'Jane Doe',
                secretUserId: 'secretUserId',
              },
            },
          },
        },
      },
    });

    expect(result.current).toHaveLength(3);

    const [home, applet, participant] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applet).toEqual({
      chip: undefined,
      image: '',
      key: expect.any(String),
      label: 'Mocked Applet',
      navPath: '/dashboard/71d90215-e4ae-41c5-8c30-776e69f5378b/participants',
      useCustomIcon: true,
    });
    expect(participant).toEqual({
      disabledLink: true,
      icon: undefined,
      key: expect.any(String),
      label: 'secretUserId',
    });
  });

  test('should generate correct breadcrumbs for participant activity details using multi-informant', () => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
      },
    });
    const route = `/dashboard/${appletId}/participants/${participantId}/activities/${activityId}`;
    const routePath = page.appletParticipantActivityDetails;

    const { result } = renderHookWithProviders(useBreadcrumbs, {
      route,
      routePath,
      preloadedState: {
        ...preloadedState,
        applet: {
          applet: {
            data: {
              result: {
                displayName: 'Mocked Applet',
                activities: [
                  {
                    id: activityId,
                    name: 'Test Activity',
                    image: 'https://admin.mindlogger.dev/image.png',
                  },
                ],
              },
            },
          },
        },
        users: {
          subjectDetails: {
            data: null,
          },
          respondentDetails: {
            data: {
              result: {
                nickname: 'Jane Doe',
                secretUserId: 'secretUserId',
              },
            },
          },
        },
      },
    });

    expect(result.current).toHaveLength(4);

    const [home, applet, participant, activityDetails] = result.current;

    expect(home).toEqual(expectedHome);
    expect(applet).toEqual({
      chip: undefined,
      image: '',
      key: expect.any(String),
      label: 'Mocked Applet',
      navPath: `/dashboard/${appletId}/participants`,
      useCustomIcon: true,
    });
    expect(participant).toEqual({
      disabledLink: false,
      icon: undefined,
      key: expect.any(String),
      label: 'secretUserId',
      navPath: `/dashboard/${appletId}/participants/${participantId}`,
    });
    expect(activityDetails).toMatchObject({
      disabledLink: true,
      image: 'https://admin.mindlogger.dev/image.png',
      label: 'Test Activity',
    });
  });
});
