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
