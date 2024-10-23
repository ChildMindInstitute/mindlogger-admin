import { AnalyticsCalendarPrefix } from 'shared/consts';

export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  SourceAccountType = 'Source Account Type',
  TargetAccountType = 'Target Account Type',
  InputAccountType = 'Input Account Type',
  IsSelfReporting = 'Is Self Reporting',
  Roles = 'Roles',
  Tag = 'Tag',
  Via = 'Via',
}

export type MixpanelPayload = Partial<Record<MixpanelProps, unknown>>;

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
}

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

export type MixpanelAction =
  | MixpanelEventType
  | MixpanelIndividualCalendarEvent
  | MixpanelGeneralCalendarEvent;
export const MixpanelCalendarEvent = {
  [AnalyticsCalendarPrefix.IndividualCalendar]: MixpanelIndividualCalendarEvent,
  [AnalyticsCalendarPrefix.GeneralCalendar]: MixpanelGeneralCalendarEvent,
} as const;
