import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { RadioGroupController, Switch } from 'shared/components/FormComponents';
import { StyledContainerWithBg, StyledTitleMedium, theme } from 'shared/styles';
import { ToggleItemContainer } from 'modules/Builder/features/ActivityItems/ItemConfiguration/InputTypeItems/ToggleItemContainer';
import { AppletFormValues } from 'modules/Builder/pages';
import { DataTable, Svg } from 'shared/components';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { SubscaleTotalScore } from 'shared/consts';

import { StyledButtonsContainer } from '../ActivitySettings.styles';
import { commonButtonProps } from '../ActivitySettings.const';
import { options } from './SubscalesConfiguration.const';
import {
  getSubscalesDefaults,
  allElementColumns,
  getNotUsedElements,
  filterItemElements,
  getUsedWithinSubscalesElements,
  getPropertiesToFilterByIds,
} from './SubscalesConfiguration.utils';
import { SubscaleHeaderContent } from './SubscaleHeaderContent';
import { SubscaleContent } from './SubscaleContent';
import { StyledSvgButton } from './SubscalesConfiguration.styles';
import { SubscaleContentProps } from './SubscalesConfiguration.types';

export const SubscalesConfiguration = () => {
  const { t } = useTranslation('app');
  const { control, watch } = useFormContext<AppletFormValues>();
  const { append: appendSubscale, remove: removeSubscale } = useFieldArray({
    control,
    name: 'subscales',
  });

  const { activity } = useCurrentActivity();
  const subscales = watch('subscales');
  const calculateTotalScoreSwitch = watch('calculateTotalScoreSwitch');
  const filteredItems = (activity?.items ?? []).filter(filterItemElements);
  const { subscalesMap, itemsMap, mergedIds, usedUniqueElementsIds } = getPropertiesToFilterByIds(
    filteredItems,
    subscales,
  );
  const notUsedElements: SubscaleContentProps['notUsedElements'] = getNotUsedElements(
    subscalesMap,
    itemsMap,
    mergedIds,
    usedUniqueElementsIds,
  );
  const usedWithinSubscalesElements = getUsedWithinSubscalesElements(
    subscales,
    subscalesMap,
    itemsMap,
    mergedIds,
    usedUniqueElementsIds,
  );

  const handleAddSubscale = () => {
    appendSubscale(getSubscalesDefaults());
  };

  const handleOnTotalScoreLookupTable = () => false;

  return (
    <StyledButtonsContainer>
      {subscales?.map((subscale, index) => (
        <ToggleItemContainer
          title={t('subscaleHeader', {
            index: index + 1,
            name: subscale?.name,
          })}
          HeaderContent={SubscaleHeaderContent}
          Content={SubscaleContent}
          headerContentProps={{
            onRemove: () => {
              removeSubscale(index);
            },
          }}
          contentProps={{
            subscaleId: subscale.id,
            name: `subscales.${index}`,
            notUsedElements,
          }}
          headerStyles={{
            justifyContent: 'space-between',
          }}
        />
      ))}
      <Button {...commonButtonProps} onClick={handleAddSubscale} sx={{ mb: theme.spacing(2) }}>
        {t('addSubscales')}
      </Button>
      <StyledTitleMedium>{t('elementsAssociatedWithSubscales')}</StyledTitleMedium>
      {!!subscales?.length && (
        <DataTable
          columns={allElementColumns}
          data={usedWithinSubscalesElements}
          noDataPlaceholder={t('noElementsYet')}
          styles={{ width: '100%' }}
        />
      )}
      <Switch
        name="calculateTotalScoreSwitch"
        control={control}
        label={t('calculateTotalScore')}
        tooltipText={t('calculateTotalScoreTooltip')}
      />
      {calculateTotalScoreSwitch && (
        <StyledContainerWithBg>
          <StyledSvgButton onClick={handleOnTotalScoreLookupTable}>
            <Svg id="lookup-table" width="20" height="20" />
          </StyledSvgButton>
          <RadioGroupController
            name="calculateTotalScore"
            control={control}
            options={options}
            defaultValue={SubscaleTotalScore.Sum}
          />
        </StyledContainerWithBg>
      )}
    </StyledButtonsContainer>
  );
};
