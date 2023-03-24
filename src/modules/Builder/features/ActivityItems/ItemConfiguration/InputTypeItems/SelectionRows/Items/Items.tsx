import { ChangeEvent } from 'react';
import { Radio, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { UploaderUiType, Uploader, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, StyledFlexTopStart } from 'shared/styles';

import {
  StyledSelectionRowItem,
  StyledItemContainer,
  StyledRemoveItemButton,
} from './Items.styles';
import { StyledSelectionBox } from '../SelectionRows.styles';
import {
  ItemConfigurationSettings,
  SelectionRowsItem,
  SelectionRowsOption,
} from '../../../ItemConfiguration.types';
import { SELECTION_ROW_OPTION_LABEL_MAX_LENGTH } from '../../../ItemConfiguration.const';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const Items = ({ isSingle }: { isSingle?: boolean }) => {
  const { t } = useTranslation('app');

  const { watch, control, setValue } = useFormContext();

  const items = watch('selectionRows.items');
  const options = watch('selectionRows.options');
  const settings = watch('settings');

  const hasTooltips = settings?.includes(ItemConfigurationSettings.HasTooltips);
  const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);
  const hasRemoveButton = items?.length > 1;

  const handleRemoveItem = (index: number) =>
    setValue(
      'selectionRows.items',
      items?.filter((item: SelectionRowsItem, key: number) => key !== index),
    );

  return items?.map((item: SelectionRowsItem, index: number) => {
    const name = `selectionRows.items[${index}]`;

    return (
      <StyledSelectionRowItem key={`row-${item.id}`} hasTooltips={hasTooltips}>
        <StyledSelectionBox>
          <StyledFlexTopStart sx={{ gap: '1.2rem' }}>
            <Uploader
              {...commonUploaderProps}
              setValue={(val: string) => setValue(`${name}.image`, val)}
              getValue={() => watch(`${name}.image`) || ''}
            />
            <InputController
              control={control}
              name={`${name}.label`}
              label={t('selectionRowsItemLabel', { index: index + 1 })}
              maxLength={SELECTION_ROW_OPTION_LABEL_MAX_LENGTH}
            />
          </StyledFlexTopStart>
          {hasTooltips && (
            <StyledFlexTopCenter>
              <InputController control={control} name={`${name}.tooltip`} label={t('tooltip')} />
            </StyledFlexTopCenter>
          )}
        </StyledSelectionBox>
        {options?.map((option: SelectionRowsOption, key: number) => {
          const scoreName = `${name}.scores[${key}]`;
          const isRemoveButtonVisible =
            hasRemoveButton && key === options?.length - 1 && index !== 0;

          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
                  />
                )}
                {isRemoveButtonVisible && (
                  <StyledRemoveItemButton onClick={() => handleRemoveItem(index)}>
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
