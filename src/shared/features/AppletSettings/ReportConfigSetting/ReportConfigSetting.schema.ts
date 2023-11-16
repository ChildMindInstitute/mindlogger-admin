import * as yup from 'yup';

import i18n from 'i18n';
import { EMAIL_REGEXP } from 'shared/consts';

const REPORT_CONFIG_EMAIL_REGEXP = new RegExp(`^$|${EMAIL_REGEXP.source}`);

export const reportConfigSchema = (isActivity: boolean, isActivityFlow: boolean) => {
  const { t } = i18n;
  const incorrectEmail = t('incorrectEmail');

  const reportIncludedItemName = {
    reportIncludedItemName: yup.string().when('itemValue', {
      is: true,
      then: (schema) => schema.required(<string>t('pleaseSelectItem')),
    }),
  };

  return yup
    .object({
      email: yup.string().matches(REPORT_CONFIG_EMAIL_REGEXP, incorrectEmail),
      ...(isActivity ? reportIncludedItemName : {}),
      ...(isActivityFlow
        ? {
            ...reportIncludedItemName,
            reportIncludedActivityName: yup.string().when('itemValue', {
              is: true,
              then: (schema) => schema.required(<string>t('pleaseSelectActivity')),
            }),
          }
        : {}),
    })
    .required();
};
