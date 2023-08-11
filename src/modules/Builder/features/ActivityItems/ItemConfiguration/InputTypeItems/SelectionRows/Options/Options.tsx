import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { UploaderUiType, Uploader } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, StyledFlexTopStart } from 'shared/styles';
import { SingleAndMultiSelectOption } from 'shared/state';

import { StyledSelectionRow, StyledSelectionBox } from '../SelectionRows.styles';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { SELECTION_ROW_OPTION_LABEL_MAX_LENGTH } from '../../../ItemConfiguration.const';
import { CharactersCounter } from '../CharactersCounter';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const Options = ({ name }: { name: string }) => {
  const { t } = useTranslation('app');

  const { watch, control, setValue } = useFormContext();

  const optionsName = `${name}.responseValues.options`;
  const options = watch(optionsName);
  const settings = watch(`${name}.config`);

  const hasTooltips = get(settings, ItemConfigurationSettings.HasTooltips);
  const hasShortenedHelper = options?.length === 3;

  return (
    <StyledSelectionRow hasTooltips={hasTooltips}>
      <StyledSelectionBox />
      {options?.map((option: SingleAndMultiSelectOption, index: number) => {
        const optionName = `${optionsName}.${index}`;

        return (
          <StyledSelectionBox key={`option-${option.id}`} isErrorShortened={hasShortenedHelper}>
            <StyledFlexTopStart sx={{ gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue(`${optionName}.image`, val || undefined)}
                getValue={() => watch(`${optionName}.image`) || ''}
              />
              <InputController
                control={control}
                name={`${optionName}.text`}
                label={t('selectionRowsOptionLabel', { index: index + 1 })}
                maxLength={SELECTION_ROW_OPTION_LABEL_MAX_LENGTH}
                restrictExceededValueLength
                Counter={CharactersCounter}
                counterProps={{ isShortenedVisible: hasShortenedHelper }}
              />
            </StyledFlexTopStart>
            {hasTooltips && (
              <StyledFlexTopCenter>
                <InputController
                  control={control}
                  name={`${optionName}.tooltip`}
                  label={t('tooltip')}
                />
              </StyledFlexTopCenter>
            )}
          </StyledSelectionBox>
        );
      })}
    </StyledSelectionRow>
  );
};
