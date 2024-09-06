import { v4 as uuidv4 } from 'uuid';

import { mockedAppletId } from 'shared/mock';

import {
  Path,
  uuidRegexp,
  getAppletPageRegexp,
  getBuilderAppletUrl,
  getUpdatedAppletUrl,
  getAppletActivityPageRegexp,
  getAppletActivityFlowPageRegexp,
  getAppletPerformanceActivityPageRegexp,
  APPLET_PAGE_REGEXP_STRING,
  ACTIVITY_PAGE_REGEXP_STRING,
  ACTIVITIES_PAGE_REGEXP_STRING,
  ACTIVITY_FLOW_PAGE_REGEXP_STRING,
  checkIfAppletUrlPassed,
  checkIfAppletSettingsUrlPassed,
  checkIfAppletActivityUrlPassed,
  checkIfPerformanceTaskUrlPassed,
  checkIfAppletActivityFlowUrlPassed,
  checkCurrentAppletPage,
  isNewApplet,
  checkCurrentActivityPage,
  checkCurrentActivityFlowPage,
} from './urlGenerator';

const mockedUuid = uuidv4();
const mockedActivityOrFlowId = uuidv4();
const mockedItemId = uuidv4();
const mockedPath = 'path';
const mockedPerfTaskUndefinedPath = `${ACTIVITIES_PAGE_REGEXP_STRING}\\/${Path.PerformanceTask}\\/undefined/(${uuidRegexp})`;
const mockedPerfTaskDefinedPath = `${ACTIVITIES_PAGE_REGEXP_STRING}\\/${Path.PerformanceTask}\\/${mockedPath}/(${uuidRegexp})`;

describe('get*Regexp', () => {
  test.each`
    path          | util                                      | expected                                                 | description
    ${undefined}  | ${getAppletPageRegexp}                    | ${APPLET_PAGE_REGEXP_STRING}                             | ${'getAppletPageRegexp: returns correct value if path is not provided'}
    ${mockedPath} | ${getAppletPageRegexp}                    | ${`${APPLET_PAGE_REGEXP_STRING}\\/${mockedPath}`}        | ${'getAppletPageRegexp: returns correct value if path is provided'}
    ${undefined}  | ${getAppletActivityPageRegexp}            | ${ACTIVITY_PAGE_REGEXP_STRING}                           | ${'getAppletActivityPageRegexp: returns correct value if path is not provided'}
    ${mockedPath} | ${getAppletActivityPageRegexp}            | ${`${ACTIVITY_PAGE_REGEXP_STRING}\\/${mockedPath}`}      | ${'getAppletActivityPageRegexp: returns correct value if path is provided'}
    ${undefined}  | ${getAppletActivityFlowPageRegexp}        | ${ACTIVITY_FLOW_PAGE_REGEXP_STRING}                      | ${'getAppletActivityFlowPageRegexp: returns correct value if path is not provided'}
    ${mockedPath} | ${getAppletActivityFlowPageRegexp}        | ${`${ACTIVITY_FLOW_PAGE_REGEXP_STRING}\\/${mockedPath}`} | ${'getAppletActivityFlowPageRegexp: returns correct value if path is provided'}
    ${undefined}  | ${getAppletPerformanceActivityPageRegexp} | ${mockedPerfTaskUndefinedPath}                           | ${'getAppletPerformanceActivityPageRegexp: returns correct value if path is not provided'}
    ${mockedPath} | ${getAppletPerformanceActivityPageRegexp} | ${mockedPerfTaskDefinedPath}                             | ${'getAppletPerformanceActivityPageRegexp: returns correct value if path is provided'}
  `('$description', ({ path, util, expected }) => {
    expect(util(path)).toBe(expected);
  });
});

describe('get*AppletUrl', () => {
  test.each`
    id                | expected                                | description
    ${''}             | ${`/${Path.Builder}/`}                  | ${'getBuilderAppletUrl: returns correct value if appletId is empty'}
    ${Path.NewApplet} | ${`/${Path.Builder}/${Path.NewApplet}`} | ${'getBuilderAppletUrl: returns correct value for new applet'}
    ${mockedUuid}     | ${`/${Path.Builder}/${mockedUuid}`}     | ${'getBuilderAppletUrl: returns correct value for existing applet'}
  `('$description', ({ id, expected }) => {
    expect(getBuilderAppletUrl(id)).toBe(expected);
  });

  test.each`
    appletId          | activityOrFlowId          | itemId          | url                                                                                             | expected                                                                                                 | description
    ${undefined}      | ${undefined}              | ${undefined}    | ${''}                                                                                           | ${''}                                                                                                    | ${'getUpdatedAppletUrl: returns initial url if there are no matches'}
    ${mockedAppletId} | ${undefined}              | ${undefined}    | ${`/builder/${mockedAppletId}`}                                                                 | ${`/builder/${mockedAppletId}`}                                                                          | ${'getUpdatedAppletUrl: returns initial applet url if appletId is not changed'}
    ${mockedAppletId} | ${undefined}              | ${undefined}    | ${`/builder/${mockedUuid}`}                                                                     | ${`/builder/${mockedAppletId}`}                                                                          | ${'getUpdatedAppletUrl: returns updated applet url if appletId is changed'}
    ${mockedAppletId} | ${undefined}              | ${undefined}    | ${`/builder/${mockedUuid}/settings`}                                                            | ${`/builder/${mockedAppletId}/settings`}                                                                 | ${'getUpdatedAppletUrl: returns updated applet url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedAppletId}/activity-flows/${mockedActivityOrFlowId}`}                        | ${`/builder/${mockedAppletId}/activity-flows/${mockedActivityOrFlowId}`}                                 | ${'getUpdatedAppletUrl: returns initial applet url if params are not changed'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}`}                                        | ${`/builder/${mockedAppletId}/activity-flows/${mockedActivityOrFlowId}`}                                 | ${'getUpdatedAppletUrl: returns updated activity flow url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/settings`}                               | ${`/builder/${mockedAppletId}/activity-flows/${mockedActivityOrFlowId}/settings`}                        | ${'getUpdatedAppletUrl: returns updated activity flow url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}`}                            | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}`}                                     | ${'getUpdatedAppletUrl: returns initial activity flow url if params are not changed'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/${mockedUuid}`}                                            | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}`}                                     | ${'getUpdatedAppletUrl: returns updated activity url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/${mockedUuid}/settings`}                                   | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}/settings`}                            | ${'getUpdatedAppletUrl: returns updated activity url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${mockedItemId} | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}/items/${mockedItemId}`}      | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}/items/${mockedItemId}`}               | ${'getUpdatedAppletUrl: returns initial activity url if params are not changed'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${mockedItemId} | ${`/builder/${mockedUuid}/activities/${mockedUuid}/items/${mockedUuid}`}                        | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}/items/${mockedItemId}`}               | ${'getUpdatedAppletUrl: returns updated activity item url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${mockedItemId} | ${`/builder/${mockedUuid}/activities/${mockedUuid}/items/${mockedUuid}/settings`}               | ${`/builder/${mockedAppletId}/activities/${mockedActivityOrFlowId}/items/${mockedItemId}/settings`}      | ${'getUpdatedAppletUrl: returns updated activity item url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedAppletId}/activities/performance-task/touch/${mockedActivityOrFlowId}`}     | ${`/builder/${mockedAppletId}/activities/performance-task/touch/${mockedActivityOrFlowId}`}              | ${'getUpdatedAppletUrl: returns initial touch url if params are not changed'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/touch/${mockedUuid}`}                     | ${`/builder/${mockedAppletId}/activities/performance-task/touch/${mockedActivityOrFlowId}`}              | ${'getUpdatedAppletUrl: returns updated touch url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/touch/${mockedUuid}/settings`}            | ${`/builder/${mockedAppletId}/activities/performance-task/touch/${mockedActivityOrFlowId}/settings`}     | ${'getUpdatedAppletUrl: returns updated touch url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedAppletId}/activities/performance-task/gyroscope/${mockedActivityOrFlowId}`} | ${`/builder/${mockedAppletId}/activities/performance-task/gyroscope/${mockedActivityOrFlowId}`}          | ${'getUpdatedAppletUrl: returns initial gyroscope url if params are not changed'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/gyroscope/${mockedUuid}`}                 | ${`/builder/${mockedAppletId}/activities/performance-task/gyroscope/${mockedActivityOrFlowId}`}          | ${'getUpdatedAppletUrl: returns updated gyroscope url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/gyroscope/${mockedUuid}/settings`}        | ${`/builder/${mockedAppletId}/activities/performance-task/gyroscope/${mockedActivityOrFlowId}/settings`} | ${'getUpdatedAppletUrl: returns updated gyroscope url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedAppletId}/activities/performance-task/flanker/${mockedActivityOrFlowId}`}   | ${`/builder/${mockedAppletId}/activities/performance-task/flanker/${mockedActivityOrFlowId}`}            | ${'getUpdatedAppletUrl: returns initial flanker url if params are not changed'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/flanker/${mockedUuid}`}                   | ${`/builder/${mockedAppletId}/activities/performance-task/flanker/${mockedActivityOrFlowId}`}            | ${'getUpdatedAppletUrl: returns updated flanker url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/flanker/${mockedUuid}/settings`}          | ${`/builder/${mockedAppletId}/activities/performance-task/flanker/${mockedActivityOrFlowId}/settings`}   | ${'getUpdatedAppletUrl: returns updated flanker url with appropriate postfix'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/unity/${mockedUuid}`}                     | ${`/builder/${mockedAppletId}/activities/performance-task/unity/${mockedActivityOrFlowId}`}              | ${'getUpdatedAppletUrl: returns updated unity url'}
    ${mockedAppletId} | ${mockedActivityOrFlowId} | ${undefined}    | ${`/builder/${mockedUuid}/activities/performance-task/unity/${mockedUuid}/settings`}            | ${`/builder/${mockedAppletId}/activities/performance-task/unity/${mockedActivityOrFlowId}/settings`}     | ${'getUpdatedAppletUrl: returns updated unity url with appropriate postfix'}
  `('$description', ({ appletId, activityOrFlowId, itemId, url, expected }) => {
    expect(getUpdatedAppletUrl(appletId, activityOrFlowId, itemId, url)).toBe(expected);
  });
});

describe('checkIf*UrlPassed', () => {
  test.each`
    url                                                                                         | util                                  | expected | description
    ${''}                                                                                       | ${checkIfAppletUrlPassed}             | ${false} | ${'checkIfAppletUrlPassed: false if no url provided'}
    ${`/dashboard/${mockedUuid}`}                                                               | ${checkIfAppletUrlPassed}             | ${false} | ${'checkIfAppletUrlPassed: false if url is not builder'}
    ${`/builder/${mockedPath}`}                                                                 | ${checkIfAppletUrlPassed}             | ${false} | ${'checkIfAppletUrlPassed: false if url is builder but appletId is not uuid'}
    ${`/builder/${mockedUuid}`}                                                                 | ${checkIfAppletUrlPassed}             | ${true}  | ${'checkIfAppletUrlPassed: true if url is builder and appletId is provided'}
    ${`/builder/${Path.NewApplet}`}                                                             | ${checkIfAppletUrlPassed}             | ${true}  | ${'checkIfAppletUrlPassed: true if url is builder and applet is new'}
    ${`/builder/${mockedUuid}/any/other/param`}                                                 | ${checkIfAppletUrlPassed}             | ${true}  | ${'checkIfAppletUrlPassed: true if url is builder and there is postfix'}
    ${''}                                                                                       | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if no url provided'}
    ${`/library/${mockedUuid}`}                                                                 | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if url is not builder or dashboard'}
    ${`/builder/${mockedPath}`}                                                                 | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if url is builder but appletId is not uuid'}
    ${`/dashboard/${mockedPath}`}                                                               | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if url is dashboard but appletId is not uuid'}
    ${`/builder/${mockedUuid}`}                                                                 | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if url is builder and appletId is provided but no settings in url'}
    ${`/dashboard/${mockedUuid}`}                                                               | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if url is dashboard and appletId is provided  but no settings in url'}
    ${`/builder/${mockedUuid}/settings`}                                                        | ${checkIfAppletSettingsUrlPassed}     | ${true}  | ${'checkIfAppletSettingsUrlPassed: true if url is builder settings and appletId is provided'}
    ${`/dashboard/${mockedUuid}/settings`}                                                      | ${checkIfAppletSettingsUrlPassed}     | ${true}  | ${'checkIfAppletSettingsUrlPassed: true if url is dashboard settings and appletId is provided'}
    ${`/builder/${Path.NewApplet}/settings`}                                                    | ${checkIfAppletSettingsUrlPassed}     | ${true}  | ${'checkIfAppletSettingsUrlPassed: true if url is builder settings and applet is new'}
    ${`/dashboard/${Path.NewApplet}/settings`}                                                  | ${checkIfAppletSettingsUrlPassed}     | ${false} | ${'checkIfAppletSettingsUrlPassed: false if url is dashboard settings and applet is new'}
    ${`/builder/${mockedUuid}/settings/any/other/param`}                                        | ${checkIfAppletSettingsUrlPassed}     | ${true}  | ${'checkIfAppletSettingsUrlPassed: true if url is builder settings and there is postfix'}
    ${`/dashboard/${mockedUuid}/settings/any/other/param`}                                      | ${checkIfAppletSettingsUrlPassed}     | ${true}  | ${'checkIfAppletSettingsUrlPassed: true if url is dashboard settings and there is postfix'}
    ${''}                                                                                       | ${checkIfAppletActivityUrlPassed}     | ${false} | ${'checkIfAppletActivityUrlPassed: false if no url provided'}
    ${`/dashboard/${mockedUuid}/activities/${mockedUuid}`}                                      | ${checkIfAppletActivityUrlPassed}     | ${false} | ${'checkIfAppletActivityUrlPassed: false if url is not activity'}
    ${`/builder/${mockedPath}/activities/${mockedUuid}`}                                        | ${checkIfAppletActivityUrlPassed}     | ${false} | ${'checkIfAppletActivityUrlPassed: false if url is activity but appletId is not uuid'}
    ${`/builder/${mockedUuid}/activities/${mockedPath}`}                                        | ${checkIfAppletActivityUrlPassed}     | ${false} | ${'checkIfAppletActivityUrlPassed: false if url is activity but activityId is not uuid'}
    ${`/builder/${mockedUuid}/settings/${mockedUuid}`}                                          | ${checkIfAppletActivityUrlPassed}     | ${false} | ${'checkIfAppletActivityUrlPassed: false if url is activity and appletId is provided but no activities in url'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}`}                                        | ${checkIfAppletActivityUrlPassed}     | ${true}  | ${'checkIfAppletActivityUrlPassed: true if url is activity and appletId and activityId are provided'}
    ${`/builder/${Path.NewApplet}/activities/${mockedUuid}`}                                    | ${checkIfAppletActivityUrlPassed}     | ${true}  | ${'checkIfAppletActivityUrlPassed: true if url is activity and applet is new'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/any/other/param`}                        | ${checkIfAppletActivityUrlPassed}     | ${true}  | ${'checkIfAppletActivityUrlPassed: true if url is activity and there is postfix'}
    ${''}                                                                                       | ${checkIfPerformanceTaskUrlPassed}    | ${false} | ${'checkIfPerformanceTaskUrlPassed: false if no url provided'}
    ${`/builder/${mockedUuid}/activities/performance-task`}                                     | ${checkIfPerformanceTaskUrlPassed}    | ${false} | ${'checkIfPerformanceTaskUrlPassed: false if url is not performance task'}
    ${`/builder/${mockedPath}/activities/performance-task/touch/${mockedPath}`}                 | ${checkIfPerformanceTaskUrlPassed}    | ${false} | ${'checkIfPerformanceTaskUrlPassed: false if appletId is not uuid'}
    ${`/builder/${mockedUuid}/activities/performance-task/touch/${mockedPath}`}                 | ${checkIfPerformanceTaskUrlPassed}    | ${false} | ${'checkIfPerformanceTaskUrlPassed: false if activityId is not uuid'}
    ${`/builder/${mockedUuid}/activities/performance-task/${mockedPath}/${mockedPath}`}         | ${checkIfPerformanceTaskUrlPassed}    | ${false} | ${'checkIfPerformanceTaskUrlPassed: false if perf task type is not touch|gyroscope|flanker'}
    ${`/builder/${Path.NewApplet}/activities/performance-task/touch/${mockedUuid}`}             | ${checkIfPerformanceTaskUrlPassed}    | ${true}  | ${'checkIfPerformanceTaskUrlPassed: true if url is correct and applet is new perf task type is touch'}
    ${`/builder/${mockedUuid}/activities/performance-task/touch/${mockedUuid}`}                 | ${checkIfPerformanceTaskUrlPassed}    | ${true}  | ${'checkIfPerformanceTaskUrlPassed: true if url is correct and perf task type is touch'}
    ${`/builder/${mockedUuid}/activities/performance-task/gyroscope/${mockedUuid}`}             | ${checkIfPerformanceTaskUrlPassed}    | ${true}  | ${'checkIfPerformanceTaskUrlPassed: true if url is correct and perf task type is gyroscope'}
    ${`/builder/${mockedUuid}/activities/performance-task/flanker/${mockedUuid}`}               | ${checkIfPerformanceTaskUrlPassed}    | ${true}  | ${'checkIfPerformanceTaskUrlPassed: true if url is correct and perf task type is flanker'}
    ${`/builder/${mockedUuid}/activities/performance-task/unity/${mockedUuid}`}                 | ${checkIfPerformanceTaskUrlPassed}    | ${true}  | ${'checkIfPerformanceTaskUrlPassed: true if url is correct and perf task type is unity'}
    ${`/builder/${mockedUuid}/activities/performance-task/touch/${mockedUuid}/any/other/param`} | ${checkIfPerformanceTaskUrlPassed}    | ${true}  | ${'checkIfPerformanceTaskUrlPassed: true if url is correct and there is postfix'}
    ${''}                                                                                       | ${checkIfAppletActivityFlowUrlPassed} | ${false} | ${'checkIfAppletActivityFlowUrlPassed: false if no url provided'}
    ${`/dashboard/${mockedUuid}/activity-flows/${mockedUuid}`}                                  | ${checkIfAppletActivityFlowUrlPassed} | ${false} | ${'checkIfAppletActivityFlowUrlPassed: false if url is not activity flow'}
    ${`/builder/${mockedPath}/activity-flows/${mockedUuid}`}                                    | ${checkIfAppletActivityFlowUrlPassed} | ${false} | ${'checkIfAppletActivityFlowUrlPassed: false if url is activity flow but appletId is not uuid'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedPath}`}                                    | ${checkIfAppletActivityFlowUrlPassed} | ${false} | ${'checkIfAppletActivityFlowUrlPassed: false if url is activity flow but activityId is not uuid'}
    ${`/builder/${mockedUuid}/settings/${mockedUuid}`}                                          | ${checkIfAppletActivityFlowUrlPassed} | ${false} | ${'checkIfAppletActivityFlowUrlPassed: false if url is activity flow and appletId is provided but no activities in url'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}`}                                    | ${checkIfAppletActivityFlowUrlPassed} | ${true}  | ${'checkIfAppletActivityFlowUrlPassed: true if url is activity flow and appletId and activityId are provided'}
    ${`/builder/${Path.NewApplet}/activity-flows/${mockedUuid}`}                                | ${checkIfAppletActivityFlowUrlPassed} | ${true}  | ${'checkIfAppletActivityFlowUrlPassed: true if url is activity flow and applet is new'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/any/other/param`}                    | ${checkIfAppletActivityFlowUrlPassed} | ${true}  | ${'checkIfAppletActivityFlowUrlPassed: true if url is correct and there is postfix'}
  `('$description', ({ url, util, expected }) => {
    expect(util(url)).toBe(expected);
  });
});

describe('checkCurrent*Page', () => {
  test.each`
    url                                                                                | util                            | flag                    | expected | description
    ${''}                                                                              | ${checkCurrentAppletPage}       | ${''}                   | ${false} | ${'checkCurrentAppletPage: false if url is empty'}
    ${`/builder/${mockedUuid}/${mockedPath}`}                                          | ${checkCurrentAppletPage}       | ${''}                   | ${false} | ${'checkCurrentAppletPage: false if url is not one of the applet page'}
    ${`/dashboard/${mockedUuid}/about`}                                                | ${checkCurrentAppletPage}       | ${''}                   | ${false} | ${'checkCurrentAppletPage: false if url is not applet page'}
    ${`/builder/${mockedUuid}/about`}                                                  | ${checkCurrentAppletPage}       | ${'isAbout'}            | ${true}  | ${'checkCurrentAppletPage: true if url is about applet'}
    ${`/builder/${Path.NewApplet}/about`}                                              | ${checkCurrentAppletPage}       | ${'isAbout'}            | ${true}  | ${'checkCurrentAppletPage: true if url is about applet and applet is new'}
    ${`/builder/${Path.NewApplet}/about/any/other/param`}                              | ${checkCurrentAppletPage}       | ${'isAbout'}            | ${true}  | ${'checkCurrentAppletPage: true if url is about applet and there is postfix'}
    ${`/builder/${mockedUuid}/activities`}                                             | ${checkCurrentAppletPage}       | ${'isActivities'}       | ${true}  | ${'checkCurrentAppletPage: true if url is activities'}
    ${`/builder/${Path.NewApplet}/activities`}                                         | ${checkCurrentAppletPage}       | ${'isActivities'}       | ${true}  | ${'checkCurrentAppletPage: true if url is activities and applet is new'}
    ${`/builder/${mockedUuid}/activities/any/other/param`}                             | ${checkCurrentAppletPage}       | ${'isActivities'}       | ${true}  | ${'checkCurrentAppletPage: true if url is activities and there is postfix'}
    ${`/builder/${mockedUuid}/activity-flows`}                                         | ${checkCurrentAppletPage}       | ${'isActivityFlow'}     | ${true}  | ${'checkCurrentAppletPage: true if url is activity flows'}
    ${`/builder/${Path.NewApplet}/activity-flows`}                                     | ${checkCurrentAppletPage}       | ${'isActivityFlow'}     | ${true}  | ${'checkCurrentAppletPage: true if url is activity flows and applet is new'}
    ${`/builder/${mockedUuid}/activity-flows/any/other/param`}                         | ${checkCurrentAppletPage}       | ${'isActivityFlow'}     | ${true}  | ${'checkCurrentAppletPage: true if url is activity flows and there is postfix'}
    ${`/builder/${mockedUuid}/settings`}                                               | ${checkCurrentAppletPage}       | ${'isAppletSettings'}   | ${true}  | ${'checkCurrentAppletPage: true if url is applet settings'}
    ${`/builder/${Path.NewApplet}/settings`}                                           | ${checkCurrentAppletPage}       | ${'isAppletSettings'}   | ${true}  | ${'checkCurrentAppletPage: true if url is applet settings and applet is new'}
    ${`/builder/${mockedUuid}/settings/any/other/param`}                               | ${checkCurrentAppletPage}       | ${'isAppletSettings'}   | ${true}  | ${'checkCurrentAppletPage: true if url is applet settings and there is postfix'}
    ${''}                                                                              | ${checkCurrentActivityPage}     | ${''}                   | ${false} | ${'checkCurrentActivityPage: false if url is empty'}
    ${`/builder/${mockedUuid}/activities/${mockedPath}`}                               | ${checkCurrentActivityPage}     | ${''}                   | ${false} | ${'checkCurrentActivityPage: false if url is not one of the activity pages'}
    ${`/dashboard/${mockedUuid}/activities/${mockedUuid}/about`}                       | ${checkCurrentActivityPage}     | ${''}                   | ${false} | ${'checkCurrentActivityPage: false if url is not activity page'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/about`}                         | ${checkCurrentActivityPage}     | ${'isAbout'}            | ${true}  | ${'checkCurrentActivityPage: true if url is about activity'}
    ${`/builder/${Path.NewApplet}/activities/${mockedUuid}/about`}                     | ${checkCurrentActivityPage}     | ${'isAbout'}            | ${true}  | ${'checkCurrentActivityPage: true if url is about activity and applet is new'}
    ${`/builder/${Path.NewApplet}/activities/${mockedUuid}/about/any/other/param`}     | ${checkCurrentActivityPage}     | ${'isAbout'}            | ${true}  | ${'checkCurrentActivityPage: true if url is about activity and there is postfix'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/items`}                         | ${checkCurrentActivityPage}     | ${'isItems'}            | ${true}  | ${'checkCurrentActivityPage: true if url is items'}
    ${`/builder/${Path.NewApplet}/activities/${mockedUuid}/items`}                     | ${checkCurrentActivityPage}     | ${'isItems'}            | ${true}  | ${'checkCurrentActivityPage: true if url is items and applet is new'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/items/any/other/param`}         | ${checkCurrentActivityPage}     | ${'isItems'}            | ${true}  | ${'checkCurrentActivityPage: true if url is items and there is postfix'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/item-flow`}                     | ${checkCurrentActivityPage}     | ${'isItemsFlow'}        | ${true}  | ${'checkCurrentActivityPage: true if url is items flow'}
    ${`/builder/${Path.NewApplet}/activities/${mockedUuid}/item-flow`}                 | ${checkCurrentActivityPage}     | ${'isItemsFlow'}        | ${true}  | ${'checkCurrentActivityPage: true if url is items flow and applet is new'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/item-flow/any/other/param`}     | ${checkCurrentActivityPage}     | ${'isItemsFlow'}        | ${true}  | ${'checkCurrentActivityPage: true if url is items flow and there is postfix'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/settings`}                      | ${checkCurrentActivityPage}     | ${'isActivitySettings'} | ${true}  | ${'checkCurrentActivityPage: true if url is applet settings'}
    ${`/builder/${Path.NewApplet}/activities/${mockedUuid}/settings`}                  | ${checkCurrentActivityPage}     | ${'isActivitySettings'} | ${true}  | ${'checkCurrentActivityPage: true if url is activity settings and applet is new'}
    ${`/builder/${mockedUuid}/activities/${mockedUuid}/settings/any/other/param`}      | ${checkCurrentActivityPage}     | ${'isActivitySettings'} | ${true}  | ${'checkCurrentActivityPage: true if url is activity settings and there is postfix'}
    ${''}                                                                              | ${checkCurrentActivityFlowPage} | ${''}                   | ${false} | ${'checkCurrentActivityFlowPage: false if url is empty'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedPath}`}                           | ${checkCurrentActivityFlowPage} | ${''}                   | ${false} | ${'checkCurrentActivityFlowPage: false if url is not one of the activity flow pages'}
    ${`/dashboard/${mockedUuid}/activity-flows/${mockedUuid}/about`}                   | ${checkCurrentActivityFlowPage} | ${''}                   | ${false} | ${'checkCurrentActivityFlowPage: false if url is not activity flow page'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/about`}                     | ${checkCurrentActivityFlowPage} | ${'isAbout'}            | ${true}  | ${'checkCurrentActivityFlowPage: true if url is about activity flow'}
    ${`/builder/${Path.NewApplet}/activity-flows/${mockedUuid}/about`}                 | ${checkCurrentActivityFlowPage} | ${'isAbout'}            | ${true}  | ${'checkCurrentActivityFlowPage: true if url is about activity flow and applet is new'}
    ${`/builder/${Path.NewApplet}/activity-flows/${mockedUuid}/about/any/other/param`} | ${checkCurrentActivityFlowPage} | ${'isAbout'}            | ${true}  | ${'checkCurrentActivityFlowPage: true if url is about activity flow and there is postfix'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/builder`}                   | ${checkCurrentActivityFlowPage} | ${'isBuilder'}          | ${true}  | ${'checkCurrentActivityFlowPage: true if url is activity flow builder'}
    ${`/builder/${Path.NewApplet}/activity-flows/${mockedUuid}/builder`}               | ${checkCurrentActivityFlowPage} | ${'isBuilder'}          | ${true}  | ${'checkCurrentActivityFlowPage: true if url is activity flow builder and applet is new'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/builder/any/other/param`}   | ${checkCurrentActivityFlowPage} | ${'isBuilder'}          | ${true}  | ${'checkCurrentActivityFlowPage: true if url is activity flow builder and there is postfix'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/settings`}                  | ${checkCurrentActivityFlowPage} | ${'isSettings'}         | ${true}  | ${'checkCurrentActivityFlowPage: true if url is activity flow settings'}
    ${`/builder/${Path.NewApplet}/activity-flows/${mockedUuid}/settings`}              | ${checkCurrentActivityFlowPage} | ${'isSettings'}         | ${true}  | ${'checkCurrentActivityFlowPage: true if url is activity flow settings and applet is new'}
    ${`/builder/${mockedUuid}/activity-flows/${mockedUuid}/settings/any/other/param`}  | ${checkCurrentActivityFlowPage} | ${'isSettings'}         | ${true}  | ${'checkCurrentActivityFlowPage: true if url is activity flow settings and there is postfix'}
  `('$description', ({ url, util, flag, expected }) => {
    expected
      ? expect(util(url)[flag]).toBe(expected)
      : expect(Object.values(util(url)).every((flag) => flag === false)).toBe(true);
  });
});

describe('isNewApplet', () => {
  test.each`
    appletId          | expected | description
    ${undefined}      | ${false} | ${'returns false if appletId is undefined'}
    ${mockedUuid}     | ${false} | ${'returns false if appletId is uuid'}
    ${Path.NewApplet} | ${true}  | ${'returns true if applet is new'}
  `('$description', ({ appletId, expected }) => {
    expect(isNewApplet(appletId)).toBe(expected);
  });
});
