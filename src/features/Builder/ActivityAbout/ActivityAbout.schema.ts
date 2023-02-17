import * as yup from 'yup';

import i18n from 'i18n';
import { MAX_NAME_LENGTH } from 'consts';

export const ActivityAboutSchema = () => {
  const { t } = i18n;
  const fieldRequired = t('fieldRequired');

  return yup
    .object({
      activityName: yup.string().required(fieldRequired).max(MAX_NAME_LENGTH),
      activityDescription: yup.string().required(fieldRequired).max(230),
      showAllQuestionsAtOnce: yup.boolean().required(),
      allowToSkipAllItems: yup.boolean().required(),
      disableAbilityToChangeResponse: yup.boolean().required(),
      onlyAdminPanelActivity: yup.boolean().required(),
    })
    .required();
};
