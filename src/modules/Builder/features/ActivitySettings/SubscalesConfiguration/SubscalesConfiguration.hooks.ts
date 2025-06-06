import { useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { getEntityKey, isSystemItem } from 'shared/utils';
import { ActivitySettingsSubscale, AgeFieldType, ScoreOrSection, ScoreReport } from 'shared/state';
import { LookupTableItems } from 'shared/consts';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { reportIsScore } from 'modules/Builder/features/ActivitySettings/ScoresAndReports/ScoresAndReports.utils';

import { ageDropdownItem, ageTextItem, genderItem } from './SubscalesConfiguration.const';

export const useSubscalesSystemItemsSetup = (
  subscales: SubscaleFormValue[],
  ageFieldType: AgeFieldType,
) => {
  const { fieldName: activityFieldName } = useCurrentActivity();
  const { watch, setValue } = useFormContext();
  const itemsFieldName = `${activityFieldName}.items`;
  const items: ItemFormValues[] = watch(itemsFieldName) ?? [];

  const { control: appletFormControl } = useFormContext();
  const reportsField = `${activityFieldName}.scoresAndReports.reports`;
  const { fields: scoreOrSectionArray, update: updateReport } = useFieldArray<
    Record<string, ScoreOrSection[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control: appletFormControl,
    name: reportsField,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const appendSystemItems = (newItems: ItemFormValues[]) =>
    setValue(itemsFieldName, [...items, ...newItems]);

  const updateReports = (
    mapItemsPrint: (itemsPrint: string[] | undefined) => string[] | undefined,
  ) => {
    scoreOrSectionArray.forEach((report, i) => {
      const updatedReport = {
        ...report,
        itemsPrint: mapItemsPrint(report.itemsPrint),
      };

      if (reportIsScore(updatedReport)) {
        updatedReport.conditionalLogic = updatedReport?.conditionalLogic?.map((condition) => ({
          ...condition,
          itemsPrint: mapItemsPrint(condition.itemsPrint),
        }));
      }

      updateReport(i, updatedReport);
    });
  };

  const removeSystemItems = () => {
    const systemItemKeys: string[] = [];

    setValue(
      itemsFieldName,
      items.filter((item) => {
        if (isSystemItem(item)) {
          systemItemKeys.push(getEntityKey(item));

          return false;
        }

        return true;
      }),
    );

    // Remove system items from report scores that include them
    updateReports(
      (itemsPrint: string[] | undefined) =>
        itemsPrint?.filter((item) => !systemItemKeys.includes(item)),
    );
  };

  const replaceSystemItems = (newSystemItems: ItemFormValues[]) => {
    const oldSystemItems: { key: string; name: string }[] = [];

    setValue(
      itemsFieldName,
      [
        ...items.filter((item) => {
          if (isSystemItem(item)) {
            oldSystemItems.push({ key: getEntityKey(item), name: item.name });

            return false;
          }

          return true;
        }),
        ...newSystemItems,
      ],
      {
        shouldDirty: true,
      },
    );

    // Replace system items in report scores that include them
    updateReports(
      (itemsPrint: string[] | undefined) =>
        itemsPrint
          ?.map((item) => {
            const oldSystemItem = oldSystemItems.find((old) => old.key === item);

            if (oldSystemItem) {
              const newItem = newSystemItems.find((newItem) => newItem.name === oldSystemItem.name);

              return newItem ? getEntityKey(newItem) : null;
            }

            return item;
          })
          .filter((it): it is string => it !== null),
    );
  };

  useEffect(() => {
    const hasSubscaleLookupTable = subscales?.some((subscale) => !!subscale.subscaleTableData);
    const hasSystemItems = items?.some((item) => isSystemItem(item));
    const shouldAddSubscaleSystemItems = hasSubscaleLookupTable && !hasSystemItems;

    const ageScreenItem = items?.find(
      (item) => isSystemItem(item) && item.name === LookupTableItems.Age_screen,
    );
    const oldAgeFieldType = ageScreenItem?.responseType === 'numberSelect' ? 'dropdown' : 'text';
    const ageFieldTypeChanged = oldAgeFieldType !== ageFieldType;
    const shouldEditSubscaleSystemItems =
      hasSubscaleLookupTable && hasSystemItems && ageFieldTypeChanged;

    const ageField: ItemFormValues = ageFieldType === 'dropdown' ? ageDropdownItem : ageTextItem;

    if (shouldAddSubscaleSystemItems) {
      appendSystemItems([genderItem, ageField]);

      return;
    } else if (shouldEditSubscaleSystemItems) {
      replaceSystemItems([genderItem, ageField]);

      return;
    }

    if (hasSubscaleLookupTable) return;

    removeSystemItems();
  }, [subscales, ageFieldType]);
};

type UseLinkedScoreReportsReturn = {
  /**
   * Remove this subscale from any report scores that are linked to it
   */
  removeReportScoreLink: (subscale: ActivitySettingsSubscale<string>) => void;

  /**
   * Update the name of a subscale in any linked score reports
   */
  updateSubscaleNameInReports: (oldSubscaleName: string, newSubscaleName: string) => void;

  /**
   * Check if there are any non-subscales in the list of subscale items
   */
  hasNonSubscaleItems: (subscaleItems: ActivitySettingsSubscale<string>['items']) => boolean;
};

/**
 * A hook that returns some utility functions for keeping report scores that are linked to subscales
 * up to date. It also ensures that linked scores are reset to 'raw_score' if there are no more
 * eligible subscales
 */
export const useLinkedScoreReports = (): UseLinkedScoreReportsReturn => {
  const { control: appletFormControl } = useFormContext();
  const { fieldName: currentActivityFieldName, activity: currentActivity } = useCurrentActivity();
  const reportsField = `${currentActivityFieldName}.scoresAndReports.reports`;
  const { fields: scoreOrSectionArray, update: updateReport } = useFieldArray<
    Record<string, ScoreOrSection[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control: appletFormControl,
    name: reportsField,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const subscalesField = `${currentActivityFieldName}.subscaleSetting.subscales`;
  const subscales: SubscaleFormValue[] = useWatch({ name: subscalesField }) ?? [];

  const hasNonSubscaleItems = useCallback(
    (subscaleItems: ActivitySettingsSubscale<string>['items']) => {
      const nonSubscaleItems =
        currentActivity?.items?.filter((item) =>
          subscaleItems.includes(getEntityKey(item, true)),
        ) ?? [];

      return nonSubscaleItems.length > 0;
    },
    [currentActivity?.items],
  );

  const eligibleSubscales = subscales.filter(({ subscaleTableData, items }) => {
    const hasLookupTable = !!subscaleTableData && subscaleTableData.length;

    return hasLookupTable && hasNonSubscaleItems(items);
  });

  const linkedScores = scoreOrSectionArray.filter(
    (report) => report.type === 'score' && report.scoringType === 'score',
  ) as ScoreReport[];

  /**
   * Remove this subscale from any report scores that are linked to it
   */
  const removeReportScoreLink = useCallback(
    (subscale: ActivitySettingsSubscale<string>) => {
      scoreOrSectionArray.forEach((report, index) => {
        if (!reportIsScore(report) || !linkedScores.includes(report)) return;

        if (report.subscaleName === subscale.name) {
          const updatedReport: ScoreReport = {
            ...report,
            subscaleName: '',
          };
          updateReport(index, updatedReport);
        }
      });
    },
    [linkedScores, updateReport, scoreOrSectionArray],
  );

  const updateSubscaleNameInReports = useCallback(
    (oldSubscaleName: string, newSubscaleName: string) => {
      const isEligibleSubscale = eligibleSubscales.some(
        (subscale) => subscale.name === oldSubscaleName,
      );
      if (!isEligibleSubscale) return;

      scoreOrSectionArray.forEach((report, index) => {
        if (!reportIsScore(report) || !linkedScores.includes(report)) return;

        if (report.subscaleName === oldSubscaleName) {
          const updatedReport: ScoreReport = {
            ...report,
            subscaleName: newSubscaleName,
          };
          updateReport(index, updatedReport);
        }
      });
    },
    [eligibleSubscales, linkedScores, updateReport, scoreOrSectionArray],
  );

  useEffect(() => {
    if (eligibleSubscales.length === 0) {
      // If there are no more eligible subscales, then these linked scores should be reset to
      // 'raw_score' instead of 'score'. Otherwise, the admin will see an error reported in the UI
      // but there will be nothing to fix when they go back to the reports screen
      scoreOrSectionArray.forEach((report, index) => {
        if (!reportIsScore(report) || !linkedScores.includes(report)) return;

        const updatedReport: ScoreReport = {
          ...report,
          subscaleName: '',
          scoringType: 'raw_score',
        };
        updateReport(index, updatedReport);
      });
    }
  }, [eligibleSubscales, linkedScores, updateReport, scoreOrSectionArray]);

  return { removeReportScoreLink, updateSubscaleNameInReports, hasNonSubscaleItems };
};
