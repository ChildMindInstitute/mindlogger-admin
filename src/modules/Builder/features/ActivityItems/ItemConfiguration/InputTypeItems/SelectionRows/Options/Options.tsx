import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { UploaderUiType, Uploader } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, StyledFlexTopStart } from 'shared/styles';
import { SingleAndMultipleSelectRow, SingleAndMultipleSelectRowOption } from 'shared/state';

import { StyledSelectionRow, StyledSelectionBox } from '../SelectionRows.styles';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { SELECTION_ROW_OPTION_LABEL_MAX_LENGTH } from '../../../ItemConfiguration.const';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const Options = ({ name }: { name: string }) => {
  const { t } = useTranslation('app');

  const { watch, control, setValue, getValues } = useFormContext();

  const rowsName = `${name}.responseValues.rows`;
  const rows = watch(rowsName);
  const settings = watch(`${name}.config`);

  const hasTooltips = get(settings, ItemConfigurationSettings.HasTooltips);

  const handleChange = (name: string, index: number, value?: string) => {
    const rows = getValues(rowsName);

    rows.forEach((_: SingleAndMultipleSelectRow, key: number) => {
      if (name === 'text' && value && value.length > SELECTION_ROW_OPTION_LABEL_MAX_LENGTH) return;

      setValue(`${rowsName}.${key}.options.${index}.${name}`, value);
    });
  };

  return (
    <StyledSelectionRow hasTooltips={hasTooltips}>
      <StyledSelectionBox />
      {rows[0]?.options?.map((option: SingleAndMultipleSelectRowOption, index: number) => {
        const optionName = `${rowsName}.0.options.${index}`;

        return (
          <StyledSelectionBox key={`option-${option.id}`}>
            <StyledFlexTopStart sx={{ gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => handleChange('image', index, val || undefined)}
                getValue={() => watch(`${optionName}.image`) || ''}
              />
              <InputController
                control={control}
                name={`${optionName}.text`}
                label={t('selectionRowsOptionLabel', { index: index + 1 })}
                maxLength={SELECTION_ROW_OPTION_LABEL_MAX_LENGTH}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange('text', index, e.target.value)
                }
              />
            </StyledFlexTopStart>
            {hasTooltips && (
              <StyledFlexTopCenter>
                <InputController
                  control={control}
                  name={`${optionName}.tooltip`}
                  label={t('tooltip')}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('tooltip', index, e.target.value)
                  }
                />
              </StyledFlexTopCenter>
            )}
          </StyledSelectionBox>
        );
      })}
    </StyledSelectionRow>
  );
};
