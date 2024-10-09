import { useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { getEntityKey, isSystemItem } from 'shared/utils';
import { ActivitySettingsSubscale, AgeFieldType, ScoreOrSection, ScoreReport } from 'shared/state';
import { LookupTableItems } from 'shared/consts';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { ageDropdownItem, ageTextItem, genderItem } from './SubscalesConfiguration.const';

export const useSubscalesSystemItemsSetup = (
  subscales: SubscaleFormValue[],
  ageFieldType: AgeFieldType,
) => {
  const { fieldName: activityFieldName } = useCurrentActivity();
  const { watch, setValue } = useFormContext();
  const itemsFieldName = `${activityFieldName}.items`;
  const items: ItemFormValues[] = watch(itemsFieldName) ?? [];

  const appendSystemItems = (newItems: ItemFormValues[]) =>
    setValue(itemsFieldName, [...items, ...newItems]);
  const removeSystemItems = () =>
    setValue(
      itemsFieldName,
      items.filter((item) => !isSystemItem(item)),
    );
  const replaceSystemItems = (newItems: ItemFormValues[]) => {
    setValue(itemsFieldName, [...items.filter((item) => !isSystemItem(item)), ...newItems], {
      shouldDirty: true,
    });
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
  const subscales: SubscaleFormValue[] = useWatch({ name: subscalesField, defaultValue: [] }) ?? [];

  const eligibleSubscales = subscales.filter(({ subscaleTableData, items }) => {
    const hasLookupTable = !!subscaleTableData && subscaleTableData.length;

    const nonSubscaleItems =
      currentActivity?.items?.filter((item) => items.includes(getEntityKey(item, true))) ?? [];
    const hasNonSubscaleItems = nonSubscaleItems.length > 0;

    return hasLookupTable && hasNonSubscaleItems;
  });

  const linkedScores = scoreOrSectionArray.filter(
    (report) => report.type === 'score' && report.scoringType === 'score',
  ) as ScoreReport[];

  /**
   * Remove this subscale from any report scores that are linked to it
   */
  const removeReportScoreLink = useCallback(
    (subscale: ActivitySettingsSubscale<string>) => {
      linkedScores.forEach((scoreReport, index) => {
        if (scoreReport.subscaleName === subscale.name) {
          const updatedReport: ScoreReport = {
            ...scoreReport,
            subscaleName: '',
          };
          updateReport(index, updatedReport);
        }
      });
    },
    [linkedScores, updateReport],
  );

  const updateSubscaleNameInReports = useCallback(
    (oldSubscaleName: string, newSubscaleName: string) => {
      const isEligibleSubscale = eligibleSubscales.some(
        (subscale) => subscale.name === oldSubscaleName,
      );
      if (!isEligibleSubscale) return;

      linkedScores.forEach((scoreReport, index) => {
        if (scoreReport.subscaleName === oldSubscaleName) {
          const updatedReport: ScoreReport = {
            ...scoreReport,
            subscaleName: newSubscaleName,
          };
          updateReport(index, updatedReport);
        }
      });
    },
    [eligibleSubscales, linkedScores, updateReport],
  );

  useEffect(() => {
    if (eligibleSubscales.length === 0) {
      // If there are no more eligible subscales, then these linked scores should be reset to
      // 'raw_score' instead of 'score'. Otherwise, the admin will see an error reported in the UI
      // but there will be nothing to fix when they go back to the reports screen
      linkedScores.forEach((scoreReport, index) => {
        const updatedReport: ScoreReport = {
          ...scoreReport,
          subscaleName: '',
          scoringType: 'raw_score',
        };
        updateReport(index, updatedReport);
      });
    }
  }, [eligibleSubscales, linkedScores, updateReport]);

  return { removeReportScoreLink, updateSubscaleNameInReports };
};
