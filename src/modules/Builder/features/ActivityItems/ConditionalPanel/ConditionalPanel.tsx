import { useState } from 'react';

import { useTranslation, Trans } from 'react-i18next';
import { Collapse } from '@mui/material';

import {
  ConditionalLogic,
  OptionCondition,
  RangeValueCondition,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultiSelectOption,
  SingleValueCondition,
} from 'shared/state';
import { getEntityKey, getObjectFromList } from 'shared/utils';
import { Svg } from 'shared/components/Svg';
import { StyledBodyLarge, StyledClearedButton, StyledFlexColumn, StyledFlexTopCenter, theme } from 'shared/styles';
import {
  ItemResponseType,
  CONDITION_TYPES_TO_HAVE_RANGE_VALUE,
  CONDITION_TYPES_TO_HAVE_SINGLE_VALUE,
  ConditionType,
} from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { ItemFormValues } from 'modules/Builder/types';
import { useCustomFormContext } from 'modules/Builder/hooks';

export const ConditionalPanel = ({ condition }: { condition?: ConditionalLogic }) => {
  const { t } = useTranslation('app');
  const [isExpanded, setExpanded] = useState(true);
  const { watch } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();

  const items = watch(`${fieldName}.items`) ?? [];
  const groupedItems = getObjectFromList<ItemFormValues>(items);
  const currentItem = groupedItems?.[condition?.itemKey ?? ''];

  return (
    <Collapse in={isExpanded} timeout={0} collapsedSize="4.8rem">
      <StyledFlexTopCenter sx={{ gap: '1rem' }}>
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
          data-testid="builder-conditional-panel-btn"
        >
          <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledBodyLarge>
          <Trans i18nKey="conditionalLogicPanelTitle">
            If
            <strong>
              {' '}
              <>{{ match: condition?.match }}</>{' '}
            </strong>
            of the “if” rules below are
            <strong>
              {' '}
              true, show item: <>{{ name: currentItem?.name ?? '' }}</>
            </strong>
          </Trans>
        </StyledBodyLarge>
      </StyledFlexTopCenter>
      {isExpanded && (
        <StyledFlexColumn sx={{ mt: theme.spacing(1.2) }} data-testid="builder-conditional-panel-expanded">
          {condition?.conditions?.map(({ key, type, itemName, payload }) => {
            const relatedItem = groupedItems[itemName];
            const valuePlaceholder = t('conditionPanelValue');

            const isSlider = relatedItem?.responseType === ItemResponseType.Slider;
            const isSingleValueShown =
              isSlider && type && CONDITION_TYPES_TO_HAVE_SINGLE_VALUE.includes(type as ConditionType);
            const isRangeValueShown =
              isSlider && type && CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(type as ConditionType);

            return (
              <StyledBodyLarge key={`condition-${key}`} sx={{ mb: theme.spacing(2.4), pl: theme.spacing(5.4) }}>
                {relatedItem?.name ?? t('conditionPanelItem')} {t('conditionPanelType', { context: type })}{' '}
                {((!isSlider || (isSlider && !type)) &&
                  (relatedItem?.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.find(
                    (option: SingleAndMultiSelectOption) =>
                      getEntityKey(option) === (payload as OptionCondition['payload'])?.optionValue,
                  )?.text) ??
                  valuePlaceholder}
                {(isSingleValueShown && (payload as SingleValueCondition['payload'])?.value) ?? valuePlaceholder}
                {isRangeValueShown &&
                  t('conditionPanelValueRange', {
                    minValue: (payload as RangeValueCondition['payload'])?.minValue ?? valuePlaceholder,
                    maxValue: (payload as RangeValueCondition['payload'])?.maxValue ?? valuePlaceholder,
                  })}
              </StyledBodyLarge>
            );
          })}
        </StyledFlexColumn>
      )}
    </Collapse>
  );
};
