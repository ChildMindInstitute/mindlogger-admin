import { ItemResponseType } from 'shared/consts';

export const defaultValues = {
  activityName: '',
  activityDescription: '',
  showAllQuestionsAtOnce: false,
  allowToSkipAllItems: false,
  disableAbilityToChangeResponse: false,
  onlyAdminPanelActivity: false,
  activityImg: '',
  activityWatermark: '',
};

export const itemsForReviewableActivity = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
];

export const commonUploaderProps = {
  width: 20,
  height: 20,
};

export const SUPPORT_LINK = 'https://mindlogger.atlassian.net/servicedesk/customer/portals';
