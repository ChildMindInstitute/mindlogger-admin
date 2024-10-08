import { lazy } from 'react';

import { page } from 'resources';

const Applets = lazy(() => import('modules/Dashboard/features/Applets'));
const Managers = lazy(() => import('modules/Dashboard/features/Managers'));
const Respondents = lazy(() => import('modules/Dashboard/features/Respondents'));
const Participants = lazy(() => import('modules/Dashboard/features/Participants'));
const ParticipantDetails = lazy(() => import('modules/Dashboard/features/Participant'));
const ParticipantDetailsByParticipant = lazy(
  () => import('modules/Dashboard/features/Participant/Assignments/ByParticipant'),
);
const ParticipantConnections = lazy(
  () => import('modules/Dashboard/features/Participant/Connections'),
);
const ParticipantSchedule = lazy(() => import('modules/Dashboard/features/Participant/Schedule'));
const Schedule = lazy(() => import('modules/Dashboard/features/Applet/Schedule'));
const Overview = lazy(() => import('modules/Dashboard/features/Applet/Overview'));
const Activities = lazy(() => import('modules/Dashboard/features/Applet/Activities'));
const AppletSettings = lazy(
  () => import('modules/Dashboard/features/Applet/DashboardAppletSettings'),
);
const RespondentDataSummary = lazy(
  () => import('modules/Dashboard/features/RespondentData/RespondentDataSummary'),
);
const RespondentDataReview = lazy(
  () => import('modules/Dashboard/features/RespondentData/RespondentDataReview'),
);

export const mainRoutes = [
  {
    path: page.dashboardApplets,
    Component: Applets,
  },
  {
    path: page.dashboardManagers,
    Component: Managers,
  },
  {
    path: page.dashboardRespondents,
    Component: Respondents,
  },
];

export const appletRoutes = [
  {
    path: page.appletOverview,
    Component: Overview,
  },
  {
    path: page.appletActivities,
    Component: Activities,
  },
  {
    path: page.appletRespondents,
    Component: Respondents,
  },
  {
    path: page.appletParticipants,
    Component: Participants,
  },
  {
    path: page.appletManagers,
    Component: Managers,
  },
  {
    path: page.appletSchedule,
    Component: Schedule,
  },
  {
    path: page.appletScheduleIndividual,
    Component: Schedule,
  },
  {
    path: page.appletSettings,
    Component: AppletSettings,
  },
  {
    path: page.appletSettingsItem,
    Component: AppletSettings,
  },
];

export const participantDetailsRoutes = [
  {
    path: page.appletParticipantDetails,
    Component: ParticipantDetails,
  },
  {
    path: page.appletParticipantDetailsByParticipant,
    Component: ParticipantDetailsByParticipant,
  },
  {
    path: page.appletParticipantConnections,
    Component: ParticipantConnections,
  },
  {
    path: page.appletParticipantSchedule,
    Component: ParticipantSchedule,
  },
];

export const participantActivityDetailsRoutes = [
  {
    path: page.appletParticipantActivityDetailsDataSummary,
    Component: RespondentDataSummary,
  },
  {
    path: page.appletParticipantActivityDetailsDataReview,
    Component: RespondentDataReview,
  },
  {
    path: page.appletParticipantActivityDetailsFlowDataSummary,
    Component: RespondentDataSummary,
  },
  {
    path: page.appletParticipantActivityDetailsFlowDataReview,
    Component: RespondentDataReview,
  },
];
