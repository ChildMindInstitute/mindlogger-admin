import { AnalyticsCalendarPrefix, ItemResponseType, ParticipantTag } from 'shared/consts';

export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  AverageItemsPerPhraseBuilder = 'Average Items per Phrase Builder',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  SourceAccountType = 'Source Account Type',
  TargetAccountType = 'Target Account Type',
  InputAccountType = 'Input Account Type',
  IsSelfReporting = 'Is Self Reporting',
  ItemCount = 'Item Count',
  ItemsIncludedInPhraseBuilders = 'Items Included in Phrase Builders',
  ItemTypes = 'Item Types',
  PhraseBuilderItemCount = 'Phrase Builder Item Count',
  Roles = 'Roles',
  Tag = 'Tag',
  Via = 'Via',
  EntityType = 'Entity Type',
  AssignmentCount = 'Assignment count',
  SelfReportAssignmentCount = 'Self-report assignment count',
  MultiInformantAssignmentCount = 'Multi-informant assignment count',
  ActivityCount = 'Activity count',
  FlowCount = 'Flow count',
  AutoAssignedActivityCount = 'Auto-assigned activity count',
  AutoAssignedFlowCount = 'Auto-assigned flow count',
  ManuallyAssignedActivityCount = 'Manually-assigned activity count',
  ManuallyAssignedFlowCount = 'Manually-assigned flow count',
}

export enum MixpanelFeature {
  MultiInformant = 'Multi-informant',
  SSI = 'SSI',
}

export enum MixpanelEventType {
  InvitationSent = 'Invitation sent successfully',
  LoginSuccessful = 'Login Successful',
  LoginBtnClick = 'Login Button click',
  Logout = 'Logout',
  CreateAccountOnLoginScreen = 'Create account button on login screen click',
  SignUpSuccessful = 'Signup Successful',
  AddActivityClick = 'Add Activity click',
  AppletEditClick = 'Applet edit click',
  ActivityEditClick = 'Activity edit click',
  ScoresAndReportBtnClick = 'Scores and Report Button Click',
  ActivityReportConfigurationClick = 'Activity - Report Configuration Click',
  AppletReportConfigurationClick = 'Applet - Report Configuration Click',
  AppletSaveClick = 'Applet Save click',
  PasswordAddedSuccessfully = 'Password added successfully',
  AppletEditSuccessful = 'Applet edit successful',
  AppletCreatedSuccessfully = 'Applet Created Successfully',
  ExportDataClick = 'Export Data click',
  TakeNowDialogClosed = 'Take Now dialogue closed',
  MultiInformantStartActivityClick = 'Multi-informant Start Activity click',
  ProvidingResponsesDropdownOpened = '"Who will be providing responses" dropdown opened',
  ProvidingResponsesSelectionChanged = '"Who will be providing responses" selection changed',
  OwnResponsesCheckboxToggled = 'Own responses checkbox toggled',
  InputtingResponsesDropdownOpened = '"Who will be inputting the responses" dropdown opened',
  InputtingResponsesSelectionChanged = '"Who will be inputting the responses" selection changed',
  ResponsesAboutDropdownOpened = '"Who are the responses about" dropdown opened',
  ResponsesAboutSelectionChanged = '"Who are the responses about" selection changed',
  TakeNowClick = 'Take Now click',
  AddParticipantBtnClicked = 'Add Participant button clicked',
  FullAccountInvitationCreated = 'Full Account invitation created successfully',
  LimitedAccountCreated = 'Limited Account created successfully',
  FullAccountInvitationFormSubmitted = 'Full Account invitation form submitted',
  AddLimitedAccountFormSubmitted = 'Add Limited Account form submitted',
  UpgradeToFullAccountInviteCreated = 'Upgrade to Full Account invitation created successfully',
  UpgradeToFullAccountFormSubmitted = 'Upgrade to Full Account invitation form submitted',
  UpgradeToFullAccountClicked = 'Upgrade to Full Account clicked',
  BuildAppletClick = 'Build Applet click',
  BrowseAppletLibraryClick = 'Browse applet library click',
  EditTeamMemberClicked = 'Edit Team Member clicked',
  AddTeamMemberBtnClicked = 'Add Team Member button clicked',
  TeamMemberInvitedSuccessfully = 'Team Member account invitation created successfully',
  TeamMemberInvitationFormSubmitted = 'Team Member account invitation form submitted',
  TeamMemberEditSuccessful = 'Team Member edited successfully',
  EditTeamMemberFormSubmitted = 'Edit Team Member form submitted',
  EditFullAccountClicked = 'Edit Full Account clicked',
  EditLimitedAccountClicked = 'Edit Limited Account clicked',
  ExportDataSuccessful = 'Export Data Successful',
  FullAccountEditedSuccessfully = 'Full Account edited successfully',
  LimitedAccountEditedSuccessfully = 'Limited Account edited successfully',
  EditFullAccountFormSubmitted = 'Edit Full Account form submitted',
  EditLimitedAccountFormSubmitted = 'Edit Limited Account form submitted',
  ViewGeneralCalendarClick = 'View General calendar click',
  ViewIndividualCalendarClick = 'View Individual calendar click',
  SubjectInvitationClick = 'Subject Invitation click',
  AddToBasketClick = 'Add to Basket click',
  GoToBasketClick = 'Go to Basket click',
  AddToAppletBuilderClick = 'Add to applet builder click',
  StartAssignActivityOrFlow = 'Start Assign Activity/Flow',
  ConfirmAssignActivityOrFlow = 'Confirm Assign Activity/Flow',
  StartUnassignActivityOrFlow = 'Start Unassign Activity/Flow',
  ConfirmUnassignActivityOrFlow = 'Confirm Unassign Activity/Flow',
}

export type MixpanelAppletSaveEventType =
  | MixpanelEventType.AppletSaveClick
  | MixpanelEventType.AppletCreatedSuccessfully
  | MixpanelEventType.AppletEditSuccessful;

export enum MixpanelIndividualCalendarEvent {
  ScheduleSaveClick = 'IC Schedule save click',
  ScheduleSuccessful = 'IC Schedule successful',
  ScheduleImportSuccessful = 'IC Schedule import successful',
  ScheduleImportClick = 'IC Schedule Import click',
}

export enum MixpanelGeneralCalendarEvent {
  ScheduleSaveClick = 'GC Schedule save click',
  ScheduleSuccessful = 'GC Schedule successful',
  ScheduleImportSuccessful = 'GC Schedule import successful',
  ScheduleImportClick = 'GC Schedule Import click',
}

export const MixpanelCalendarEvent = {
  [AnalyticsCalendarPrefix.IndividualCalendar]: MixpanelIndividualCalendarEvent,
  [AnalyticsCalendarPrefix.GeneralCalendar]: MixpanelGeneralCalendarEvent,
} as const;

type WithAppletId<T> = T & { [MixpanelProps.AppletId]?: string | null };

export type WithFeature<T = object> = T & {
  [MixpanelProps.Feature]?: MixpanelFeature[];
};

export type MixpanelInvitationSentEvent = WithAppletId<{
  action: MixpanelEventType.InvitationSent;
}>;

export type LoginSuccessfulEvent = {
  action: MixpanelEventType.LoginSuccessful;
};

export type LoginBtnClickEvent = {
  action: MixpanelEventType.LoginBtnClick;
};

export type LogoutEvent = {
  action: MixpanelEventType.Logout;
};

export type CreateAccountOnLoginScreenEvent = {
  action: MixpanelEventType.CreateAccountOnLoginScreen;
};

export type SignUpSuccessfulEvent = {
  action: MixpanelEventType.SignUpSuccessful;
};

export type AddActivityClickEvent = WithAppletId<{
  action: MixpanelEventType.AddActivityClick;
}>;

export type ActivityEditClickEvent = WithAppletId<{
  action: MixpanelEventType.ActivityEditClick;
}>;

export type AppletEditClickEvent = WithAppletId<{
  action: MixpanelEventType.AppletEditClick;
}>;

export type ScoresAndReportBtnClickEvent = WithAppletId<{
  action: MixpanelEventType.ScoresAndReportBtnClick;
}>;

export type ActivityReportConfigurationClickEvent = WithAppletId<{
  action: MixpanelEventType.ActivityReportConfigurationClick;
}>;

export type AppletReportConfigurationClickEvent = WithAppletId<{
  action: MixpanelEventType.AppletReportConfigurationClick;
}>;

export type WithAppletSaveProps<T> = T &
  WithFeature<
    WithAppletId<{
      [MixpanelProps.ItemTypes]: ItemResponseType[];
      [MixpanelProps.ItemCount]: number;
      [MixpanelProps.PhraseBuilderItemCount]: number;
      [MixpanelProps.ItemsIncludedInPhraseBuilders]: number;
      [MixpanelProps.AverageItemsPerPhraseBuilder]: number | null;
    }>
  >;

export type AppletSaveClickEvent = WithAppletSaveProps<{
  action: MixpanelEventType.AppletSaveClick;
  [MixpanelProps.AutoAssignedActivityCount]?: number;
  [MixpanelProps.AutoAssignedFlowCount]?: number;
  [MixpanelProps.ManuallyAssignedActivityCount]?: number;
  [MixpanelProps.ManuallyAssignedFlowCount]?: number;
}>;

export type PasswordAddedSuccessfullyEvent = WithAppletId<{
  action: MixpanelEventType.PasswordAddedSuccessfully;
}>;

export type AppletEditSuccessfulEvent = WithAppletSaveProps<{
  action: MixpanelEventType.AppletEditSuccessful;
}>;

export type AppletCreatedSuccessfullyEvent = WithAppletSaveProps<{
  action: MixpanelEventType.AppletCreatedSuccessfully;
}>;

export type AppletSaveEvent =
  | AppletSaveClickEvent
  | AppletEditSuccessfulEvent
  | AppletCreatedSuccessfullyEvent;

export type ExportDataClickEvent = WithAppletId<{
  action: MixpanelEventType.ExportDataClick;
}>;

type TakeNowEvent = WithFeature<
  WithAppletId<{
    [MixpanelProps.MultiInformantAssessmentId]?: string | null;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
  }>
>;

export type TakeNowDialogClosedEvent = TakeNowEvent & {
  action: MixpanelEventType.TakeNowDialogClosed;
};

export type MultiInformantStartActivityClickEvent = TakeNowEvent & {
  action: MixpanelEventType.MultiInformantStartActivityClick;
  [MixpanelProps.SourceAccountType]?: string | null;
  [MixpanelProps.TargetAccountType]?: string | null;
  [MixpanelProps.InputAccountType]?: string | null;
  [MixpanelProps.IsSelfReporting]: boolean;
};

export type ProvidingResponsesDropdownOpenedEvent = TakeNowEvent & {
  action: MixpanelEventType.ProvidingResponsesDropdownOpened;
};

export type ProvidingResponsesSelectionChangedEvent = TakeNowEvent & {
  action: MixpanelEventType.ProvidingResponsesSelectionChanged;
  [MixpanelProps.SourceAccountType]?: string | null;
};

export type OwnResponsesCheckboxToggledEvent = TakeNowEvent & {
  action: MixpanelEventType.OwnResponsesCheckboxToggled;
  [MixpanelProps.IsSelfReporting]: boolean;
};

export type InputtingResponsesDropdownOpenedEvent = TakeNowEvent & {
  action: MixpanelEventType.InputtingResponsesDropdownOpened;
};

export type InputtingResponsesSelectionChangedEvent = TakeNowEvent & {
  action: MixpanelEventType.InputtingResponsesSelectionChanged;
  [MixpanelProps.InputAccountType]?: string | null;
};

export type ResponsesAboutDropdownOpenedEvent = TakeNowEvent & {
  action: MixpanelEventType.ResponsesAboutDropdownOpened;
};

export type ResponsesAboutSelectionChangedEvent = TakeNowEvent & {
  action: MixpanelEventType.ResponsesAboutSelectionChanged;
  [MixpanelProps.TargetAccountType]?: string | null;
};

export type TakeNowClickEvent = TakeNowEvent & {
  action: MixpanelEventType.TakeNowClick;
  [MixpanelProps.TargetAccountType]?: string | null;
  [MixpanelProps.SourceAccountType]?: string | null;
  [MixpanelProps.Via]?: 'Applet - Activities' | 'Applet - Participants - Activities';
};

export type AddParticipantBtnClickedEvent = WithAppletId<{
  action: MixpanelEventType.AddParticipantBtnClicked;
  [MixpanelProps.Via]: 'Applet - Overview' | 'Applet - Participants';
}>;

export type FullAccountInvitationCreatedEvent = WithAppletId<{
  action: MixpanelEventType.FullAccountInvitationCreated;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type LimitedAccountCreatedEvent = WithAppletId<{
  action: MixpanelEventType.LimitedAccountCreated;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type FullAccountInvitationFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.FullAccountInvitationFormSubmitted;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type AddLimitedAccountFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.AddLimitedAccountFormSubmitted;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type UpgradeToFullAccountInviteCreatedEvent = WithAppletId<{
  action: MixpanelEventType.UpgradeToFullAccountInviteCreated;
}>;

export type UpgradeToFullAccountFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.UpgradeToFullAccountFormSubmitted;
}>;

export type UpgradeToFullAccountClickedEvent = WithAppletId<{
  action: MixpanelEventType.UpgradeToFullAccountClicked;
  [MixpanelProps.Via]: 'Applet - Participants';
}>;

export type BuildAppletClickEvent = {
  action: MixpanelEventType.BuildAppletClick;
};

export type BrowseAppletLibraryClickEvent = {
  action: MixpanelEventType.BrowseAppletLibraryClick;
};

export type EditTeamMemberClickedEvent = WithAppletId<{
  action: MixpanelEventType.EditTeamMemberClicked;
  [MixpanelProps.Via]: 'Applet - Team' | 'Team';
}>;

export type AddTeamMemberBtnClickedEvent = WithAppletId<{
  action: MixpanelEventType.AddTeamMemberBtnClicked;
  [MixpanelProps.Via]: 'Applet - Team' | 'Team';
}>;

export type TeamMemberInvitedSuccessfullyEvent = WithAppletId<{
  action: MixpanelEventType.TeamMemberInvitedSuccessfully;
  [MixpanelProps.Roles]: string[];
}>;

export type TeamMemberInvitationFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.TeamMemberInvitationFormSubmitted;
  [MixpanelProps.Roles]: string[];
}>;

export type TeamMemberEditSuccessfulEvent = WithAppletId<{
  action: MixpanelEventType.TeamMemberEditSuccessful;
  [MixpanelProps.Roles]: string[];
}>;

export type EditTeamMemberFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.EditTeamMemberFormSubmitted;
  [MixpanelProps.Roles]: string[];
}>;

export type EditFullAccountClickedEvent = WithAppletId<{
  action: MixpanelEventType.EditFullAccountClicked;
  [MixpanelProps.Via]: 'Applet - Participants';
}>;

export type EditLimitedAccountClickedEvent = WithAppletId<{
  action: MixpanelEventType.EditLimitedAccountClicked;
  [MixpanelProps.Via]: 'Applet - Participants';
}>;

export type ExportDataSuccessfulEvent = WithAppletId<{
  action: MixpanelEventType.ExportDataSuccessful;
}>;

export type FullAccountEditedSuccessfullyEvent = WithAppletId<{
  action: MixpanelEventType.FullAccountEditedSuccessfully;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type LimitedAccountEditedSuccessfullyEvent = WithAppletId<{
  action: MixpanelEventType.LimitedAccountEditedSuccessfully;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type EditFullAccountFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.EditFullAccountFormSubmitted;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type EditLimitedAccountFormSubmittedEvent = WithAppletId<{
  action: MixpanelEventType.EditLimitedAccountFormSubmitted;
  [MixpanelProps.Tag]?: Exclude<ParticipantTag, ''> | null;
}>;

export type ViewGeneralCalendarClickEvent = WithAppletId<{
  action: MixpanelEventType.ViewGeneralCalendarClick;
}>;

export type ViewIndividualCalendarClickEvent = WithAppletId<{
  action: MixpanelEventType.ViewIndividualCalendarClick;
}>;

export type SubjectInvitationClickEvent = {
  action: MixpanelEventType.SubjectInvitationClick;
};

export type AddToBasketClickEvent = WithAppletId<{
  action: MixpanelEventType.AddToBasketClick;
}>;

export type GoToBasketClickEvent = WithAppletId<{
  action: MixpanelEventType.GoToBasketClick;
}>;

export type AddToAppletBuilderClickEvent = {
  action: MixpanelEventType.AddToAppletBuilderClick;
};

export type ScheduleSaveClickEvent = WithAppletId<{
  action:
    | MixpanelIndividualCalendarEvent.ScheduleSaveClick
    | MixpanelGeneralCalendarEvent.ScheduleSaveClick;
}>;

export type ScheduleSuccessfulEvent = WithAppletId<{
  action:
    | MixpanelIndividualCalendarEvent.ScheduleSuccessful
    | MixpanelGeneralCalendarEvent.ScheduleSuccessful;
}>;

export type ScheduleImportSuccessfulEvent = WithAppletId<{
  action:
    | MixpanelIndividualCalendarEvent.ScheduleImportSuccessful
    | MixpanelGeneralCalendarEvent.ScheduleImportSuccessful;
}>;

export type ScheduleImportClickEvent = WithAppletId<{
  action:
    | MixpanelIndividualCalendarEvent.ScheduleImportClick
    | MixpanelGeneralCalendarEvent.ScheduleImportClick;
}>;

export type StartAssignActivityOrFlowEvent = WithAppletId<{
  action: MixpanelEventType.StartAssignActivityOrFlow;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
  [MixpanelProps.EntityType]?: 'activity' | 'flow';
  [MixpanelProps.Via]?:
    | 'Applet - Activities'
    | 'Applet - Participants'
    | 'Data Viz'
    | 'Participant - Activities'
    | 'Participant - Assignments';
}>;

export type ConfirmAssignActivityOrFlowEvent = WithAppletId<{
  action: MixpanelEventType.ConfirmAssignActivityOrFlow;
  [MixpanelProps.AssignmentCount]?: number;
  [MixpanelProps.SelfReportAssignmentCount]?: number;
  [MixpanelProps.MultiInformantAssignmentCount]?: number;
  [MixpanelProps.ActivityCount]?: number;
  [MixpanelProps.FlowCount]?: number;
}>;

export type StartUnAssignActivityOrFlowEvent = WithAppletId<{
  action: MixpanelEventType.StartUnassignActivityOrFlow;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
  [MixpanelProps.EntityType]?: 'activity' | 'flow';
  [MixpanelProps.Via]?: 'Participant - Assignments';
}>;

export type ConfirmUnAssignActivityOrFlowEvent = WithAppletId<{
  action: MixpanelEventType.ConfirmUnassignActivityOrFlow;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
  [MixpanelProps.EntityType]?: 'activity' | 'flow';
  [MixpanelProps.AssignmentCount]?: number;
  [MixpanelProps.SelfReportAssignmentCount]?: number;
  [MixpanelProps.MultiInformantAssignmentCount]?: number;
}>;

export type MixpanelEvent =
  | MixpanelInvitationSentEvent
  | LoginSuccessfulEvent
  | LoginBtnClickEvent
  | LogoutEvent
  | CreateAccountOnLoginScreenEvent
  | SignUpSuccessfulEvent
  | AddActivityClickEvent
  | ActivityEditClickEvent
  | AppletEditClickEvent
  | ScoresAndReportBtnClickEvent
  | ActivityReportConfigurationClickEvent
  | AppletReportConfigurationClickEvent
  | AppletSaveClickEvent
  | PasswordAddedSuccessfullyEvent
  | AppletEditSuccessfulEvent
  | AppletCreatedSuccessfullyEvent
  | ExportDataClickEvent
  | TakeNowDialogClosedEvent
  | MultiInformantStartActivityClickEvent
  | ProvidingResponsesDropdownOpenedEvent
  | ProvidingResponsesSelectionChangedEvent
  | OwnResponsesCheckboxToggledEvent
  | InputtingResponsesDropdownOpenedEvent
  | InputtingResponsesSelectionChangedEvent
  | ResponsesAboutDropdownOpenedEvent
  | ResponsesAboutSelectionChangedEvent
  | TakeNowClickEvent
  | AddParticipantBtnClickedEvent
  | FullAccountInvitationCreatedEvent
  | LimitedAccountCreatedEvent
  | FullAccountInvitationFormSubmittedEvent
  | AddLimitedAccountFormSubmittedEvent
  | UpgradeToFullAccountInviteCreatedEvent
  | UpgradeToFullAccountFormSubmittedEvent
  | UpgradeToFullAccountClickedEvent
  | BuildAppletClickEvent
  | BrowseAppletLibraryClickEvent
  | EditTeamMemberClickedEvent
  | AddTeamMemberBtnClickedEvent
  | TeamMemberInvitedSuccessfullyEvent
  | TeamMemberInvitationFormSubmittedEvent
  | TeamMemberEditSuccessfulEvent
  | EditTeamMemberFormSubmittedEvent
  | EditFullAccountClickedEvent
  | EditLimitedAccountClickedEvent
  | ExportDataSuccessfulEvent
  | FullAccountEditedSuccessfullyEvent
  | LimitedAccountEditedSuccessfullyEvent
  | EditFullAccountFormSubmittedEvent
  | EditLimitedAccountFormSubmittedEvent
  | ViewGeneralCalendarClickEvent
  | ViewIndividualCalendarClickEvent
  | SubjectInvitationClickEvent
  | AddToBasketClickEvent
  | GoToBasketClickEvent
  | AddToAppletBuilderClickEvent
  | ScheduleSaveClickEvent
  | ScheduleSuccessfulEvent
  | ScheduleImportSuccessfulEvent
  | ScheduleImportClickEvent
  | StartAssignActivityOrFlowEvent
  | ConfirmAssignActivityOrFlowEvent
  | StartUnAssignActivityOrFlowEvent
  | ConfirmUnAssignActivityOrFlowEvent;
