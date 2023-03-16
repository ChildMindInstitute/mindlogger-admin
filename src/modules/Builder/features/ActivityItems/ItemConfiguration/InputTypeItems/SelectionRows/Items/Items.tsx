import { Radio, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import {
  ItemConfigurationSettings,
  SelectionRowsItem,
  SelectionRowsOption,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { UploaderUiType, Uploader } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter } from 'shared/styles';

import { StyledSelectionRowItem } from './Items.styles';
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

  return items?.map((item: SelectionRowsItem, index: number) => {
    const name = `selectionRows.items[${index}]`;

    return (
      <StyledSelectionRowItem key={`row-${index}`} hasTooltips={hasTooltips}>
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
              maxLength={75}
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
        {options?.map((option: SelectionRowsOption, index: number) => {
          if (hasScores)
            return (
              <StyledSelectionBox key={`score-input-${index}`}>
                <InputController
                  label={t('score')}
                  type="number"
                  control={control}
                  name={`${name}.scores[${index}]`}
                  minNumberValue={Number.MIN_SAFE_INTEGER}
                />
              </StyledSelectionBox>
            );

          return (
            <StyledSelectionBox
              key={`control-placeholder-${index}`}
              sx={{ justifyContent: 'center' }}
            >
              {isSingle ? <Radio disabled /> : <Checkbox disabled />}
            </StyledSelectionBox>
          );
        })}
      </StyledSelectionRowItem>
    );
  });
};
