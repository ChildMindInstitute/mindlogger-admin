import { useWatch, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { StyledFlexColumn, StyledFlexTopStart, StyledTitleMedium, theme } from 'shared/styles';
import {
  useCheckAndTriggerOnNameUniqueness,
  useCurrentActivity,
  useCustomFormContext,
} from 'modules/Builder/hooks';
import {
  InputController,
  SelectController,
  TransferListController,
} from 'shared/components/FormComponents';
import { DataTable } from 'shared/components/DataTable';
import { SubscaleFormValue } from 'modules/Builder/types';
import { checkOnItemTypeAndScore } from 'shared/utils/checkOnItemTypeAndScore';
import { useLinkedScoreReports } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/SubscalesConfiguration.hooks';
import { SubscaleTotalScore } from 'shared/consts';

import { scoreValues } from './SubscaleContent.const';
import { SubscaleContentProps } from '../SubscalesConfiguration.types';
import {
  getItemElements,
  getColumns,
  getNotUsedElementsTableColumns,
} from '../SubscalesConfiguration.utils';
import { StyledWrapper } from './SubscaleContent.styles';

export const SubscaleContent = ({
  subscaleId,
  name,
  notUsedElements,
  'data-testid': dataTestid,
}: SubscaleContentProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const { clearErrors, trigger, getFieldState } = useFormContext();
  const { fieldName = '', activity } = useCurrentActivity();
  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const subscales: SubscaleFormValue[] = useWatch({ name: subscalesField });
  const [subscaleName, scoringType, selectedItems]: [string, SubscaleTotalScore, string[]] =
    useWatch({
      name: [`${name}.name`, `${name}.scoring`, `${name}.items`],
    });

  const items = getItemElements(
    subscaleId,
    activity?.items.filter(checkOnItemTypeAndScore),
    subscales || [],
    scoringType,
  );

  const { updateSubscaleNameInReports, hasNonSubscaleItems, removeReportScoreLink } =
    useLinkedScoreReports();

  useCheckAndTriggerOnNameUniqueness({
    currentPath: name,
    entitiesFieldPath: subscalesField,
  });

  useEffect(() => {
    const subscale = subscales?.find((subscale) => subscale.id === subscaleId);

    if (subscale && !hasNonSubscaleItems(subscale.items)) {
      removeReportScoreLink(subscale);
    }
  }, [hasNonSubscaleItems, removeReportScoreLink, subscaleId, subscales]);

  useEffect(() => {
    // Removes and prevents adding nested subscales when Percentage is selected
    if (scoringType === SubscaleTotalScore.Percentage) {
      const subscaleIds = subscales.map((subscale) => subscale.id ?? '');
      const filteredItems = selectedItems.filter((id) => !subscaleIds.includes(id));

      if (filteredItems.length !== selectedItems.length) {
        setValue(`${name}.items`, filteredItems);
      }
    }
  }, [scoringType, selectedItems, subscales, setValue, name]);

  return (
    <StyledFlexColumn sx={{ mt: theme.spacing(2) }}>
      <StyledFlexTopStart sx={{ mb: theme.spacing(2.4), gap: theme.spacing(2) }}>
        <InputController
          key={`${name}.name`}
          name={`${name}.name`}
          label={t('subscaleName')}
          data-testid={`${dataTestid}-name`}
          withDebounce
          onInput={(e) => {
            const currentValue = (e.target as HTMLInputElement).value;
            // Clear errors immediately when typing (lightweight)
            if (currentValue !== '' && getFieldState(`${name}.name`).error) {
              clearErrors(`${name}.name`);
            }
          }}
          onChange={(e, applyChange) => {
            const currentValue = (e.target as HTMLInputElement).value;
            if (currentValue === '') {
              setValue(`${name}.name`, currentValue, { shouldValidate: true });
              updateSubscaleNameInReports(subscaleName, '');

              return;
            }
            applyChange();
            // Trigger validation immediately after debounced change
            setTimeout(() => trigger(`${name}.name`), 100);
          }}
          onBlur={(e) => {
            const currentValue = (e.target as HTMLInputElement).value;
            setValue(`${name}.name`, currentValue, { shouldValidate: true });
            updateSubscaleNameInReports(subscaleName, currentValue);
          }}
        />
        <SelectController
          name={`${name}.scoring`}
          control={control}
          fullWidth
          options={scoreValues}
          label={t('subscaleScoring')}
          data-testid={`${dataTestid}-scoring`}
        />
      </StyledFlexTopStart>
      <StyledTitleMedium sx={{ mb: theme.spacing(1) }}>
        {t('elementsWithinSubscale')}
      </StyledTitleMedium>
      <StyledWrapper>
        <TransferListController
          name={`${name}.items`}
          items={items}
          columns={getColumns()}
          hasSearch={false}
          hasSelectedSection={false}
          useVirtualizedList={process.env.NODE_ENV !== 'test'}
          data-testid={`${dataTestid}-items`}
          onChangeSelectedCallback={() => {
            // Clear errors immediately when user selects/deselects items
            clearErrors(`${name}.items`);
            // Trigger validation after selection change
            setTimeout(() => {
              trigger(`${name}.items`);
            }, 100);
          }}
        />
        <DataTable
          columns={getNotUsedElementsTableColumns()}
          data={notUsedElements}
          noDataPlaceholder={t('noElementsYet')}
          data-testid={`${dataTestid}-unused-items`}
        />
      </StyledWrapper>
    </StyledFlexColumn>
  );
};
