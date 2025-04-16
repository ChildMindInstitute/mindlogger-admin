import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks';
import { doubleBrackets, getEntityKey } from 'shared/utils';

import { itemsForReviewableActivity } from '../../ActivityAbout/ActivityAbout.const';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { ItemsOption, ItemsOptionGroup } from './ItemConfiguration.types';
import { checkIfQuestionIncludesVariables } from './ItemConfiguration.utils';

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
    .reduce((groups: ItemsOptionGroup[], { groupName, groupOptions }) => {
      if (isReviewable) {
        // Reviewable activities only support 3 possible item types in the 'select' group:
        // single selection, multiple selection, and slider. Skip all other groups and item types.

        if (groupName !== 'select') return groups;

        return [
          {
            groupName,
            groupOptions: groupOptions.filter(({ value }) =>
              itemsForReviewableActivity.includes(value),
            ),
          },
        ];
      }

      const transformers: Record<string, (options: ItemsOption[]) => ItemsOption[]> = {
        downloadable: (options: ItemsOption[]) =>
          options.filter(
            ({ value }) =>
              value !== ItemResponseType.PhrasalTemplate || featureFlags.enablePhrasalTemplate,
          ),
        input: (options: ItemsOption[]) =>
          options.filter(
            ({ value }) =>
              value !== ItemResponseType.ParagraphText || featureFlags.enableParagraphTextItem,
          ),
        import: (options: ItemsOption[]) => {
          const filteredOptions = options.filter(
            ({ value }) => value !== ItemResponseType.RequestHealthRecordData,
          );

          const processedHealthOption = options.find(
            ({ value }) => value === ItemResponseType.RequestHealthRecordData,
          );

          // This should always be true, doing this for type safety
          if (processedHealthOption) {
            if (hasExistingHealthRecordItem) {
              return [
                ...filteredOptions,
                {
                  ...processedHealthOption,
                  disabled: true,
                  tooltip: t('requestHealthRecordDataSettings.disabledTooltip'),
                },
              ];
            }

            if (
              featureFlags.enableEhrHealthData === 'active' ||
              featureFlags.enableEhrHealthData === 'available'
            ) {
              return [...filteredOptions, processedHealthOption];
            }
          }

          return filteredOptions;
        },
      };

      return [
        ...groups,
        {
          groupName,
          groupOptions: transformers[groupName]?.(groupOptions) ?? groupOptions,
        },
      ];
    }, [])
    .filter(({ groupOptions }) => groupOptions.length > 0);

  return availableItemsTypeOptions;
};
