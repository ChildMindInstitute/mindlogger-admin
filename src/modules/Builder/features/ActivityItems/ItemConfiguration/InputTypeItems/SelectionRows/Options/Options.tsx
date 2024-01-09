import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { useCustomFormContext } from 'modules/Builder/hooks';
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

  const { watch, control, setValue } = useCustomFormContext();

  const optionsName = `${name}.responseValues.options`;
  const options = watch(optionsName);
  const settings = watch(`${name}.config`);

  const hasTooltips = get(settings, ItemConfigurationSettings.HasTooltips);
  const hasShortenedHelper = options?.length === 3;

  const commonInputProps = { maxlength: SELECTION_ROW_OPTION_LABEL_MAX_LENGTH };

  return (
    <StyledSelectionRow hasTooltips={hasTooltips}>
      <StyledSelectionBox />
      {options?.map((option: SingleAndMultiSelectOption, index: number) => {
        const optionName = `${optionsName}.${index}`;
        const dataTestId = `builder-activity-items-item-configuration-selection-rows-option-${index}`;

        return (
          <StyledSelectionBox
            key={`option-${option.id}`}
            isErrorShortened={hasShortenedHelper}
            data-testid={dataTestId}
          >
            <StyledFlexTopStart sx={{ gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue(`${optionName}.image`, val || undefined)}
                getValue={() => watch(`${optionName}.image`) || ''}
                data-testid={`${dataTestId}-image`}
              />
              <InputController
                withDebounce
                control={control}
                name={`${optionName}.text`}
                label={t('selectionRowsOptionLabel', { index: index + 1 })}
                maxLength={SELECTION_ROW_OPTION_LABEL_MAX_LENGTH}
                restrictExceededValueLength
                Counter={CharactersCounter}
                counterProps={{ isShortenedVisible: hasShortenedHelper }}
                data-testid={`${dataTestId}-text`}
                inputProps={commonInputProps}
              />
            </StyledFlexTopStart>
            {hasTooltips && (
              <StyledFlexTopCenter>
                <InputController
                  withDebounce
                  control={control}
                  name={`${optionName}.tooltip`}
                  label={t('tooltip')}
                  data-testid={`${dataTestId}-tooltip`}
                  inputProps={commonInputProps}
                />
              </StyledFlexTopCenter>
            )}
          </StyledSelectionBox>
        );
      })}
    </StyledSelectionRow>
  );
};
