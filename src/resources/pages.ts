export default {
  login: '/auth',
  signUp: '/auth/signup',
  passwordReset: '/auth/reset-password',
  passwordRecovery: '/auth/password-recovery',
  lock: '/auth/lock',
  dashboard: '/dashboard',
  dashboardManagers: '/dashboard/managers',
  dashboardRespondents: '/dashboard/respondents',
  dashboardApplets: '/dashboard/applets',
  applet: '/dashboard/:appletId',
  appletOverview: '/dashboard/:appletId/overview',
  appletActivities: '/dashboard/:appletId/activities',
  appletRespondents: '/dashboard/:appletId/respondents',
  appletParticipants: '/dashboard/:appletId/participants',
  appletParticipantDetails: '/dashboard/:appletId/participants/:subjectId',
  appletParticipantDetailsByParticipant: '/dashboard/:appletId/participants/:subjectId/respondent',
  appletParticipantActivityDetails:
    '/dashboard/:appletId/participants/:subjectId/activities/:activityId',
  appletParticipantActivityDetailsDataSummary:
    '/dashboard/:appletId/participants/:subjectId/activities/:activityId/summary',
  appletParticipantActivityDetailsDataReview:
    '/dashboard/:appletId/participants/:subjectId/activities/:activityId/responses',
  appletParticipantActivityDetailsFlowDataSummary:
    '/dashboard/:appletId/participants/:subjectId/activityFlows/:activityFlowId/summary',
  appletParticipantActivityDetailsFlowDataReview:
    '/dashboard/:appletId/participants/:subjectId/activityFlows/:activityFlowId/responses',
  appletParticipantConnections: '/dashboard/:appletId/participants/:subjectId/connections',
  appletParticipantSchedule: '/dashboard/:appletId/participants/:subjectId/schedule',
  /**
   * @deprecated
   * This pre-multiinformant version of a respondant view is activity/flow-agnostic and
   * should no longer be referenced. Use appletParticipantActivityDetailsData{Summary/Review} or
   * appletParticipantActivityDetailsFlowData{Summary/Review} instead.
   */
  appletRespondentData: '/dashboard/:appletId/respondents/:respondentId/dataviz',
  /**
   * @deprecated
   * This pre-multiinformant version of the Summary tab is activity/flow-agnostic and
   * should no longer be referenced. Use appletParticipantActivityDetailsDataSummary or
   * appletParticipantActivityDetailsFlowDataSummary instead.
   */
  appletParticipantDataSummary: '/dashboard/:appletId/participants/:subjectId/dataviz/summary',
  /**
   * @deprecated
   * This pre-multiinformant version of the Responses tab is activity/flow-agnostic and
   * should no longer be referenced. Use appletParticipantActivityDetailsDataReview or
   * appletParticipantActivityDetailsFlowDataReview instead.
   */
  appletParticipantDataReview: '/dashboard/:appletId/participants/:subjectId/dataviz/responses',
  appletManagers: '/dashboard/:appletId/managers',
  appletSchedule: '/dashboard/:appletId/schedule',
  appletScheduleIndividual: '/dashboard/:appletId/schedule/:respondentId',
  appletSettings: '/dashboard/:appletId/settings',
  appletSettingsItem: '/dashboard/:appletId/settings/:setting',
  appletAddUser: '/dashboard/:appletId/add-user',
  builder: '/builder',
  builderApplet: '/builder/:appletId',
  builderAppletAbout: '/builder/:appletId/about',
  builderAppletActivities: '/builder/:appletId/activities',
  builderAppletActivity: '/builder/:appletId/activities/:activityId',
  builderAppletActivityAbout: '/builder/:appletId/activities/:activityId/about',
  builderAppletActivityItems: '/builder/:appletId/activities/:activityId/items',
  builderAppletActivityItem: '/builder/:appletId/activities/:activityId/items/:itemId',
  builderAppletActivityItemFlow: '/builder/:appletId/activities/:activityId/item-flow',
  builderAppletActivitySettings: '/builder/:appletId/activities/:activityId/settings',
  builderAppletActivitySettingsItem: '/builder/:appletId/activities/:activityId/settings/:setting',
  builderAppletFlanker: '/builder/:appletId/activities/performance-task/flanker/:activityId',
  builderAppletGyroscope: '/builder/:appletId/activities/performance-task/gyroscope/:activityId',
  builderAppletTouch: '/builder/:appletId/activities/performance-task/touch/:activityId',
  builderAppletUnity: '/builder/:appletId/activities/performance-task/unity/:activityId',
  builderAppletActivityFlow: '/builder/:appletId/activity-flows',
  builderAppletActivityFlowItem: '/builder/:appletId/activity-flows/:activityFlowId',
  builderAppletActivityFlowItemAbout: '/builder/:appletId/activity-flows/:activityFlowId/about',
  builderAppletActivityFlowItemBuilder: '/builder/:appletId/activity-flows/:activityFlowId/builder',
  builderAppletActivityFlowItemSettings:
    '/builder/:appletId/activity-flows/:activityFlowId/settings',
  builderAppletActivityFlowItemSettingsItem:
    '/builder/:appletId/activity-flows/:activityFlowId/settings/:setting',
  builderAppletSettings: '/builder/:appletId/settings',
  builderAppletSettingsItem: '/builder/:appletId/settings/:setting',
  library: '/library',
  libraryAppletDetails: '/library/:appletId',
  libraryCart: '/library/cart',
};
