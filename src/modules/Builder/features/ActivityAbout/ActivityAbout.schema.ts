import * as yup from 'yup';

import i18n from 'i18n';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_NAME_LENGTH } from 'shared/consts';

export const ActivityAboutSchema = () => {
  const { t } = i18n;
  const fieldRequired = t('fieldRequired');

  return yup
    .object({
      activityName: yup.string().required(fieldRequired).max(MAX_NAME_LENGTH),
      activityDescription: yup.string().required(fieldRequired).max(MAX_DESCRIPTION_LENGTH_LONG),
      showAllQuestionsAtOnce: yup.boolean(),
      allowToSkipAllItems: yup.boolean(),
      disableAbilityToChangeResponse: yup.boolean(),
      onlyAdminPanelActivity: yup.boolean(),
    })
    .required();
};
