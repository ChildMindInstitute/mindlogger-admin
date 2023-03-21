import { Radio, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import {
  ItemConfigurationSettings,
  SelectionRowsItem,
  SelectionRowsOption,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { UploaderUiType, Uploader, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter } from 'shared/styles';

import {
  StyledSelectionRowItem,
  StyledItemContainer,
  StyledRemoveItemButton,
} from './Items.styles';
import { StyledSelectionBox } from '../SelectionRows.styles';

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
          <StyledFlexTopCenter sx={{ gap: '1.2rem' }}>
            <Uploader
              {...commonUploaderProps}
              setValue={(val: string) => setValue(`${name}.image`, val)}
              getValue={() => watch(`${name}.image`) || ''}
            />
            <InputController
              control={control}
              name={`${name}.label`}
              placeholder={t('selectionRowsItemPlaceholder', { index: index + 1 })}
              maxLength={11}
            />
          </StyledFlexTopCenter>
          {hasTooltips && (
            <StyledFlexTopCenter>
              <InputController
                control={control}
                name={`${name}.tooltip`}
                placeholder={t('tooltip')}
              />
            </StyledFlexTopCenter>
          )}
        </StyledSelectionBox>
        {options?.map((option: SelectionRowsOption, key: number) => (
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
                  name={`${name}.scores[${key}]`}
                  minNumberValue={Number.MIN_SAFE_INTEGER}
                />
              )}
              {hasRemoveButton && key === options?.length - 1 && index !== 0 && (
                <StyledRemoveItemButton onClick={() => handleRemoveItem(index)}>
                  <Svg id="cross" />
                </StyledRemoveItemButton>
              )}
            </StyledItemContainer>
          </StyledSelectionBox>
        ))}
      </StyledSelectionRowItem>
    );
  });
};
