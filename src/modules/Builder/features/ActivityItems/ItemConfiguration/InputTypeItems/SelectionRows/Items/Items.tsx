import { ChangeEvent } from 'react';
import { Radio, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { UploaderUiType, Uploader, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, StyledFlexTopStart } from 'shared/styles';
import {
  SingleAndMultipleSelectRow,
  SingleAndMultiSelectRowOption,
  SingleAndMultipleSelectMatrix,
  ItemAlert,
} from 'shared/state';

import {
  StyledSelectionRowItem,
  StyledItemContainer,
  StyledRemoveItemButton,
} from './Items.styles';
import { ItemsProps } from './Items.types';
import { CharactersCounter } from '../CharactersCounter';
import { StyledSelectionBox } from '../SelectionRows.styles';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { SELECTION_ROW_OPTION_LABEL_MAX_LENGTH } from '../../../ItemConfiguration.const';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const Items = ({ name, isSingle }: ItemsProps) => {
  const { t } = useTranslation('app');

  const { watch, control, setValue, getValues } = useCustomFormContext();

  const optionsName = `${name}.responseValues.options`;
  const dataMatrixName = `${name}.responseValues.dataMatrix`;
  const rows = watch(`${name}.responseValues.rows`);
  const options = watch(optionsName);
  const settings = watch(`${name}.config`);
  const alerts = watch(`${name}.alerts`);

  const hasTooltips = get(settings, ItemConfigurationSettings.HasTooltips);
  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
  const hasRemoveButton = rows?.length > 1;
  const hasShortenedHelper = options?.length === 3;

  const handleRemoveItem = (index: number) => {
    if (hasAlerts) {
      const rowToRemove = rows[index];

      alerts?.forEach(({ rowId }: ItemAlert, index: number) => {
        if (rowId === rowToRemove?.id) setValue(`${name}.alerts.${index}.rowId`, '');
      });
    }

    setValue(
      `${name}.responseValues.rows`,
      rows?.filter((row: SingleAndMultipleSelectRow, key: number) => key !== index),
    );

    if (hasScores) {
      const dataMatrix = getValues(dataMatrixName);

      setValue(
        dataMatrixName,
        dataMatrix?.filter(
          (dataMatrixRow: SingleAndMultipleSelectMatrix, key: number) => key !== index,
        ),
      );
    }
  };

  const commonInputProps = { maxlength: SELECTION_ROW_OPTION_LABEL_MAX_LENGTH };

  return rows?.map((row: SingleAndMultipleSelectRow, index: number) => {
    const rowName = `${name}.responseValues.rows.${index}`;
    const dataTestid = `builder-activity-items-item-configuration-selection-rows-row-${index}`;

    return (
      <StyledSelectionRowItem
        key={`row-${row.id}`}
        hasTooltips={hasTooltips}
        data-testid={dataTestid}
      >
        <StyledSelectionBox isErrorShortened={hasShortenedHelper}>
          <StyledFlexTopStart sx={{ gap: '1.2rem' }}>
            <Uploader
              {...commonUploaderProps}
              setValue={(val: string) => setValue(`${rowName}.rowImage`, val || undefined)}
              getValue={() => watch(`${rowName}.rowImage`) || ''}
              data-testid={`${dataTestid}-image`}
            />
            <InputController
              withDebounce
              control={control}
              name={`${rowName}.rowName`}
              label={t('selectionRowsItemLabel', { index: index + 1 })}
              maxLength={SELECTION_ROW_OPTION_LABEL_MAX_LENGTH}
              restrictExceededValueLength
              Counter={CharactersCounter}
              counterProps={{ isShortenedVisible: hasShortenedHelper }}
              data-testid={`${dataTestid}-text`}
              inputProps={commonInputProps}
            />
          </StyledFlexTopStart>
          {hasTooltips && (
            <StyledFlexTopCenter>
              <InputController
                withDebounce
                control={control}
                name={`${rowName}.tooltip`}
                label={t('tooltip')}
                data-testid={`${dataTestid}-tooltip`}
                inputProps={commonInputProps}
              />
            </StyledFlexTopCenter>
          )}
        </StyledSelectionBox>
        {options?.map((option: SingleAndMultiSelectRowOption, key: number) => {
          const scoreName = `${dataMatrixName}.${index}.options.${key}.score`;
          const isRemoveButtonVisible =
            hasRemoveButton && key === options?.length - 1 && index !== 0;

          const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (event.target.value === '') return setValue(scoreName, 0);

            setValue(scoreName, +event.target.value);
          };

          return (
            <StyledSelectionBox key={`score-input-${key}`}>
              <StyledItemContainer>
                {isSingle ? (
                  <Radio disabled />
                ) : (
                  <Checkbox disabled checked checkedIcon={<Svg id="checkbox-outlined" />} />
                )}
                {hasScores && (
                  <InputController
                    label={t('score')}
                    type="number"
                    control={control}
                    name={scoreName}
                    onChange={handleChange}
                    minNumberValue={Number.MIN_SAFE_INTEGER}
                    data-testid={`${dataTestid}-score-${key}`}
                  />
                )}
                {isRemoveButtonVisible && (
                  <StyledRemoveItemButton
                    onClick={() => handleRemoveItem(index)}
                    data-testid={`${dataTestid}-remove`}
                  >
                    <Svg id="cross" />
                  </StyledRemoveItemButton>
                )}
              </StyledItemContainer>
            </StyledSelectionBox>
          );
        })}
      </StyledSelectionRowItem>
    );
  });
};
