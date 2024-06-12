import { FieldError } from 'react-hook-form';

import i18n from 'i18n';
import { VALIDATED_ITEMS_COUNT } from 'modules/Builder/components/ConditionRow_old/ConditionRow.const';

const { t } = i18n;

export const getErrorMessages = (errorObject: Record<string, unknown>) =>
  Object.keys(errorObject).flatMap((key) => {
    if (key === 'conditions' && Array.isArray(errorObject[key])) {
      const conditionsError = errorObject[key] as FieldError[];

      return conditionsError.map((conditionError, index) => ({
        key: `${key}-${index}`,
        message: t(
          Object.keys(conditionError).length === VALIDATED_ITEMS_COUNT
            ? 'setUpAtLeastOneCondition'
            : 'setUpCorrectCondition',
        ),
      }));
    }

    return {
      message: (errorObject[key] as FieldError).message,
      key,
    };
  });
