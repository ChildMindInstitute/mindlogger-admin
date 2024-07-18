import i18n from 'i18n';
import { Option } from 'shared/components/FormComponents';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { ConditionalLogicMatch } from 'shared/consts';

import { ConditionWithResponseType, GetMatchOptionsProps } from '../SummaryRow.types';
import { getObjectFromListByItemId } from './getObjectFromListByItemId';
import { checkIfHasContradiction } from './checkIfHasContradiction';

const { t } = i18n;

export const getMatchOptions = ({ items, conditions = [] }: GetMatchOptionsProps): Option[] => {
  const itemsObject = getObjectFromList(items);
  const conditionItems = conditions.reduce((acc, condition) => {
    const item = itemsObject[condition.itemName];
    if (!item) return acc;

    return acc.concat({
      responseValues: item.responseValues,
      responseType: item.responseType,
      ...condition,
    });
  }, [] as ConditionWithResponseType[]);
  const conditionsByItemId = getObjectFromListByItemId(conditionItems);
  const hasContradiction = checkIfHasContradiction(conditionsByItemId);

  return [
    {
      value: ConditionalLogicMatch.Any,
      labelKey: t('any'),
    },
    {
      value: ConditionalLogicMatch.All,
      labelKey: t('all'),
      disabled: hasContradiction,
      tooltip: hasContradiction
        ? t('conditionalLogicValidation.impossibleToFulfillTheConditionsSimultaneously')
        : undefined,
    },
  ];
};
