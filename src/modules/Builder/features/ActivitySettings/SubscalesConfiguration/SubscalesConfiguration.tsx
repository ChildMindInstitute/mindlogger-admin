import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { RadioGroupController } from 'shared/components/FormComponents';
import { StyledContainerWithBg, StyledTitleMedium, theme } from 'shared/styles';
import { ToggleItemContainer } from 'modules/Builder/components';
import { DataTable, Svg, SwitchWithState } from 'shared/components';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { SubscaleTotalScore } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { ActivitySettingsSubscale } from 'shared/state';

import { StyledButtonsContainer } from '../ActivitySettings.styles';
import { commonButtonProps } from '../ActivitySettings.const';
import { options } from './SubscalesConfiguration.const';
import {
  getSubscalesDefaults,
  allElementsTableColumns,
  getNotUsedElements,
  checkOnItemType,
  getUsedWithinSubscalesElements,
  getPropertiesToFilterByIds,
} from './SubscalesConfiguration.utils';
import { SubscaleHeaderContent } from './SubscaleHeaderContent';
import { SubscaleContent } from './SubscaleContent';
import { StyledSvgButton } from './SubscalesConfiguration.styles';
import { SubscaleContentProps } from './SubscalesConfiguration.types';

export const SubscalesConfiguration = () => {
  const { t } = useTranslation('app');
  const { control, watch, register, unregister, setValue } = useFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const subscalesField = `${fieldName}.subscales`;
  const calculateTotalScoreName = `${fieldName}.calculateTotalScore`;
  const {
    append: appendSubscale,
    remove: removeSubscale,
    update: updateSubscale,
  } = useFieldArray({
    control,
    name: subscalesField,
  });
  const [calculateTotalScoreSwitch, setCalculateTotalScoreSwitch] = useState(false);

  const subscales: ActivitySettingsSubscale[] = watch(subscalesField);
  const filteredItems = (activity?.items ?? []).filter(checkOnItemType);
  const { subscalesMap, itemsMap, mergedIds, markedUniqueElementsIds } = getPropertiesToFilterByIds(
    filteredItems,
    subscales,
  );
  const notUsedElements: SubscaleContentProps['notUsedElements'] = getNotUsedElements(
    subscalesMap,
    itemsMap,
    mergedIds,
    markedUniqueElementsIds,
  );
  const usedWithinSubscalesElements = getUsedWithinSubscalesElements(
    subscales,
    subscalesMap,
    itemsMap,
    mergedIds,
    markedUniqueElementsIds,
  );

  const handleAddSubscale = () => {
    appendSubscale(getSubscalesDefaults());
  };

  const handleOnTotalScoreLookupTable = () => false;

  useEffect(() => {
    if (calculateTotalScoreSwitch) {
      register(calculateTotalScoreName);
      setValue(calculateTotalScoreName, SubscaleTotalScore.Sum);

      return;
    }

    unregister(calculateTotalScoreName);
    setValue(calculateTotalScoreName, undefined);
  }, [calculateTotalScoreSwitch]);

  return (
    <StyledButtonsContainer>
      {subscales?.map((subscale, index) => {
        const subscaleField = `${subscalesField}.${index}`;
        const title = t('subscaleHeader', {
          index: index + 1,
          name: subscale?.name,
        });

        return (
          <ToggleItemContainer
            key={`data-subscale-${getEntityKey(subscale) || index}`}
            HeaderContent={SubscaleHeaderContent}
            Content={SubscaleContent}
            headerContentProps={{
              onRemove: () => {
                removeSubscale(index);
              },
              name: subscaleField,
              title,
              onUpdate: (subscaleTableData?: string) => {
                if (subscaleTableData === undefined) {
                  unregister(`${subscaleField}.subscaleTableData`);
                }
                updateSubscale(index, {
                  ...subscale,
                  subscaleTableData,
                });
              },
            }}
            contentProps={{
              subscaleId: subscale.id,
              name: subscaleField,
              notUsedElements,
            }}
          />
        );
      })}
      <Button {...commonButtonProps} onClick={handleAddSubscale} sx={{ mb: theme.spacing(2) }}>
        {t('addSubscales')}
      </Button>
      <StyledTitleMedium>{t('elementsAssociatedWithSubscales')}</StyledTitleMedium>
      {!!subscales?.length && (
        <DataTable
          columns={allElementsTableColumns}
          data={usedWithinSubscalesElements}
          noDataPlaceholder={t('noElementsYet')}
          styles={{ width: '100%' }}
        />
      )}
      <SwitchWithState
        checked={calculateTotalScoreSwitch}
        handleChange={() => {
          setCalculateTotalScoreSwitch((prevState) => !prevState);
        }}
        label={t('calculateTotalScore')}
        tooltipText={t('calculateTotalScoreTooltip')}
      />
      {calculateTotalScoreSwitch && (
        <StyledContainerWithBg>
          <StyledSvgButton onClick={handleOnTotalScoreLookupTable}>
            <Svg id="lookup-table" width="20" height="20" />
          </StyledSvgButton>
          <RadioGroupController
            name={calculateTotalScoreName}
            control={control}
            options={options}
          />
        </StyledContainerWithBg>
      )}
    </StyledButtonsContainer>
  );
};
