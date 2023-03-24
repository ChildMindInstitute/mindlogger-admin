import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { UploaderUiType, Uploader } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, StyledFlexTopStart } from 'shared/styles';

import { StyledSelectionRow, StyledSelectionBox } from '../SelectionRows.styles';
import { ItemConfigurationSettings, SelectionRowsOption } from '../../../ItemConfiguration.types';
import { SELECTION_ROW_OPTION_LABEL_MAX_LENGTH } from '../../../ItemConfiguration.const';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const Options = () => {
  const { t } = useTranslation('app');

  const { watch, control, setValue } = useFormContext();

  const options = watch('selectionRows.options');
  const settings = watch('settings');

  const hasTooltips = settings?.includes(ItemConfigurationSettings.HasTooltips);

  return (
    <StyledSelectionRow hasTooltips={hasTooltips}>
      <StyledSelectionBox />
      {options?.map((option: SelectionRowsOption, index: number) => {
        const name = `selectionRows.options[${index}]`;

        return (
          <StyledSelectionBox key={`option-${index}`}>
            <StyledFlexTopStart sx={{ gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue(`${name}.image`, val)}
                getValue={() => watch(`${name}.image`) || ''}
              />
              <InputController
                control={control}
                name={`${name}.label`}
                label={t('selectionRowsOptionLabel', { index: index + 1 })}
                maxLength={SELECTION_ROW_OPTION_LABEL_MAX_LENGTH}
              />
            </StyledFlexTopStart>
            {hasTooltips && (
              <StyledFlexTopCenter>
                <InputController control={control} name={`${name}.tooltip`} label={t('tooltip')} />
              </StyledFlexTopCenter>
            )}
          </StyledSelectionBox>
        );
      })}
    </StyledSelectionRow>
  );
};
