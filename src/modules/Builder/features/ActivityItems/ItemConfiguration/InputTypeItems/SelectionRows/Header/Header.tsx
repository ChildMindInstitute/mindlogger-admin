import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { Svg } from 'shared/components/Svg';
import { SelectEvent } from 'shared/types/event';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
} from 'shared/styles';
import {
  ItemAlert,
  SingleAndMultipleSelectMatrix,
  SingleAndMultiSelectRowOption,
} from 'shared/state';
import { getObjectFromList } from 'shared/utils';

import { StyledSelectController } from './Header.styles';
import { HeaderProps } from './Header.types';
import { getMultipleSelectionRowsOptions } from './Header.utils';
import { getEmptySelectionItemOptions } from '../../../ItemConfiguration.utils';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE } from '../../../ItemConfiguration.const';

const commonButtonProps = {
  sx: { p: theme.spacing(1) },
};

export const Header = ({ name, isSingle, isExpanded, onArrowClick }: HeaderProps) => {
  const { t } = useTranslation('app');

  const { watch, getValues, setValue } = useCustomFormContext();

  const optionsName = `${name}.responseValues.options`;
  const options = watch(optionsName);

  const settings = watch(`${name}.config`);

  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);

  const handleChange = (e: SelectEvent) => {
    const options = getValues(optionsName);

    const newValue = +e.target.value;
    const lessThanBefore = newValue < options?.length;

    const newOptions = lessThanBefore
      ? options?.slice(0, newValue)
      : [...options, ...getEmptySelectionItemOptions(newValue - options?.length)];

    setValue(optionsName, newOptions);

    if (hasAlerts) {
      const newOptionsIds = getObjectFromList(newOptions);

      setValue(
        `${name}.alerts`,
        getValues(`${name}.alerts`)?.map((alert: ItemAlert) => {
          if (!newOptionsIds[alert.optionId ?? ''])
            return {
              ...alert,
              optionId: '',
            };

          return alert;
        }),
      );
    }

    if (hasScores || hasAlerts) {
      const dataMatrix = getValues(`${name}.responseValues.dataMatrix`);

      setValue(
        `${name}.responseValues.dataMatrix`,
        dataMatrix?.map((dataMatrixRow: SingleAndMultipleSelectMatrix) => ({
          ...dataMatrixRow,
          options: lessThanBefore
            ? dataMatrixRow.options?.slice(0, newValue)
            : newOptions.map((option: SingleAndMultiSelectRowOption, index: number) => ({
                optionId: option.id,
                ...(hasScores && {
                  score: dataMatrixRow.options?.[index]?.score ?? DEFAULT_SCORE_VALUE,
                }),
              })),
        })),
      );
    }
  };

  const dataTestid = 'builder-activity-items-item-configuration-selection-rows';

  return (
    <StyledFlexTopCenter sx={{ gap: '2.6rem' }}>
      <StyledClearedButton
        onClick={onArrowClick}
        {...commonButtonProps}
        data-testid={`${dataTestid}-collapse`}
      >
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge data-testid={`${dataTestid}-title`}>
        {t('selectionRowsHeader', { context: isSingle ? 'single' : 'multiple' })}
      </StyledLabelBoldLarge>
      {isExpanded && (
        <StyledClearedButton {...commonButtonProps} data-testid={`${dataTestid}-options`}>
          <StyledSelectController
            name="selectionRows.options.length"
            options={getMultipleSelectionRowsOptions()}
            customChange={handleChange}
            variant="standard"
            value={`${options?.length || ''}`}
            disabled={!isExpanded}
            data-testid={`${dataTestid}-options-select`}
          />
        </StyledClearedButton>
      )}
    </StyledFlexTopCenter>
  );
};
