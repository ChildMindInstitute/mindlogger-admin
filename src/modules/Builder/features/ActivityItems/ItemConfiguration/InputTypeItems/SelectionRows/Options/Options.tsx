import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import {
  ItemConfigurationSettings,
  SelectionRowsOption,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { UploaderUiType, Uploader } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter } from 'shared/styles';

import { StyledSelectionRow, StyledSelectionBox } from '../SelectionRows.styles';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

const MAX_LABEL_LENGTH = 11;

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
            <StyledFlexTopCenter sx={{ gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue(`${name}.image`, val)}
                getValue={() => watch(`${name}.image`) || ''}
              />
              <InputController
                control={control}
                name={`${name}.label`}
                placeholder={t('selectionRowsOptionPlaceholder', { index: index + 1 })}
                maxLength={MAX_LABEL_LENGTH}
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
        );
      })}
    </StyledSelectionRow>
  );
};
