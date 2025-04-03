import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { doubleBrackets, getEntityKey } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks';
import { ItemResponseType } from 'shared/consts';
import { ItemFormValues } from 'modules/Builder/types';

import { checkIfQuestionIncludesVariables } from './ItemConfiguration.utils';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { ItemsOptionGroup } from './ItemConfiguration.types';
import { itemsForReviewableActivity } from '../../ActivityAbout/ActivityAbout.const';

export const useCheckIfItemHasVariables = (itemField: string) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { watch, setValue, trigger } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();
  const activityItems = watch(`${fieldName}.items`) ?? [];
  const questionField = `${itemField}.question`;
  const isSkippable = watch(`${fieldName}.isSkippable`);
  const question = watch(questionField) ?? '';
  const isQuestionIncludesVariables =
    isSkippable && checkIfQuestionIncludesVariables(question, activityItems);
  const message = 'variablesWarning.isSkippable';

  const onPopupConfirm = () => {
    setValue(questionField, question.replace(doubleBrackets, ''));
    trigger(questionField);
    setIsPopupVisible(false);
  };

  useEffect(() => {
    setIsPopupVisible(isQuestionIncludesVariables);
  }, [isQuestionIncludesVariables]);

  return { isPopupVisible, onPopupConfirm, message };
};

export const useGetAvailableItemTypeOptions = (name: string) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const { fieldName, activity } = useCurrentActivity();
  const [isReviewable, currentItem]: [boolean, ItemFormValues] = useWatch({
    name: [`${fieldName}.isReviewable`, name],
  });

  const hasExistingHealthRecordItem = activity?.items?.some(
    (item) =>
      item.responseType === ItemResponseType.RequestHealthRecordData &&
      getEntityKey(item) !== getEntityKey(currentItem),
  );

  const availableItemsTypeOptions = itemsTypeOptions
    .reduce((options: ItemsOptionGroup[], { groupName, groupOptions }) => {
      if (isReviewable) {
        // Reviewable activities only support 3 possible item types in the 'select' group:
        // single selection, multiple selection, and slider. Skip all other groups and item types.

        if (groupName !== 'select') return options;

        return [
          {
            groupName,
            groupOptions: groupOptions.filter(({ value }) =>
              itemsForReviewableActivity.includes(value),
            ),
          },
        ];
      }

      let newGroupOptions = groupOptions;

      switch (groupName) {
        case 'downloadable':
          newGroupOptions = groupOptions.filter(
            ({ value }) =>
              value !== ItemResponseType.PhrasalTemplate || featureFlags.enablePhrasalTemplate,
          );
          break;
        case 'input':
          newGroupOptions = groupOptions.filter(
            ({ value }) =>
              value !== ItemResponseType.ParagraphText || featureFlags.enableParagraphTextItem,
          );
          break;
        case 'import':
          newGroupOptions = groupOptions.filter(
            ({ value }) =>
              value !== ItemResponseType.RequestHealthRecordData ||
              featureFlags.enableEhrHealthData === 'active',
          );

          // Add disabled flag & tooltip to RequestHealthRecordData option if such an item exists
          if (hasExistingHealthRecordItem) {
            newGroupOptions = newGroupOptions.map((option) =>
              option.value === ItemResponseType.RequestHealthRecordData
                ? {
                    ...option,
                    disabled: true,
                    tooltip: t('requestHealthRecordDataSettings.disabledTooltip'),
                  }
                : option,
            );
          }
          break;
      }

      return [
        ...options,
        {
          groupName,
          groupOptions: newGroupOptions,
        },
      ];
    }, [])
    .filter(({ groupOptions }) => groupOptions.length > 0);

  return availableItemsTypeOptions;
};
