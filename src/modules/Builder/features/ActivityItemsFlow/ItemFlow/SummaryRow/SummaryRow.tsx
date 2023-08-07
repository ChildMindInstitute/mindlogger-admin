import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, StyledTitleMedium, variables, theme } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import {
  StyledSummaryRow,
  StyledSummarySelectController,
} from 'shared/styles/styledComponents/ConditionalSummary';

import { SummaryRowProps } from './SummaryRow.types';
import { getMatchOptions, getItemsOptions } from './SummaryRow.utils';

export const SummaryRow = ({ name, error }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue, trigger } = useFormContext();

  const { fieldName } = useCurrentActivity();
  const items = watch(`${fieldName}.items`);
  const selectedItem = watch(`${name}.itemKey`);

  useEffect(() => {
    if (!selectedItem) return;

    trigger(`${name}.itemKey`);

    const itemIndex = items?.findIndex(
      (item: ItemFormValues) => getEntityKey(item) === selectedItem,
    );

    if (itemIndex !== -1) setValue(`${fieldName}.items.${itemIndex}.isHidden`, false);
  }, [selectedItem]);

  return (
    <>
      <StyledSummaryRow>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>
        <StyledSummarySelectController
          control={control}
          name={`${name}.match`}
          options={getMatchOptions()}
          placeholder={t('select')}
        />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <StyledSummarySelectController
          control={control}
          name={`${name}.itemKey`}
          options={getItemsOptions(items)}
          placeholder={t('conditionItemNamePlaceholder')}
          error={error}
          SelectProps={{
            renderValue: (value: unknown) => {
              const itemName = items?.find(
                (item: ItemFormValues) => getEntityKey(item) === value,
              )?.name;

              return <span>{t('conditionItemSelected', { value: itemName })}</span>;
            },
          }}
        />
      </StyledSummaryRow>
      {error && (
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error, pl: theme.spacing(0.8) }}>
          {error?.message ?? ''}
        </StyledBodyLarge>
      )}
    </>
  );
};
