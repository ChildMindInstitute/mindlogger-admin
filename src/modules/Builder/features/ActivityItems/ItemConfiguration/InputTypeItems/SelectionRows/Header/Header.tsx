import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import { SelectEvent } from 'shared/types/event';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  variables,
  theme,
} from 'shared/styles';
import { SingleAndMultipleSelectRow } from 'shared/state';

import { StyledSelectController } from './Header.styles';
import { HeaderProps } from './Header.types';
import { getMultipleSelectionRowsOptions } from './Header.utils';
import { getEmptySelectionItemOptions } from '../../../ItemConfiguration.utils';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
// import { options } from '../../../Alerts/Alert';

const commonSelectArrowProps = {
  id: 'navigate-down',
  sx: {
    fill: variables.palette.primary,
  },
};

const commonButtonProps = {
  sx: { p: theme.spacing(1) },
};

export const Header = ({ name, isSingle, isExpanded, onArrowClick }: HeaderProps) => {
  const { t } = useTranslation('app');

  const rowsName = `${name}.responseValues.rows`;

  const { watch, getValues, setValue } = useFormContext();

  const rows = watch(`${rowsName}`);
  const settings = watch(`${name}.config`);

  const hasScores = get(settings, ItemConfigurationSettings.HasScores);

  const handleChange = (e: SelectEvent) => {
    const rows = getValues(`${rowsName}`);

    if (+e.target.value < rows[0]?.options?.length) {
      setValue(
        rowsName,
        rows?.map((row: SingleAndMultipleSelectRow) => ({
          ...row,
          options: row.options?.slice(0, +e.target.value),
        })),
      );
    } else {
      setValue(
        rowsName,
        rows?.map((row: SingleAndMultipleSelectRow) => ({
          ...row,
          options: [
            ...row.options,
            ...getEmptySelectionItemOptions(+e.target.value - row.options?.length, hasScores),
          ],
        })),
      );
    }
  };

  return (
    <StyledFlexTopCenter sx={{ gap: '2.6rem' }}>
      <StyledClearedButton onClick={onArrowClick} {...commonButtonProps}>
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge>
        {t('selectionRowsHeader', { context: isSingle ? 'single' : 'multiple' })}
      </StyledLabelBoldLarge>
      {isExpanded && (
        <StyledClearedButton {...commonButtonProps}>
          <StyledSelectController
            name="selectionRows.options.length"
            options={getMultipleSelectionRowsOptions()}
            customChange={handleChange}
            variant="standard"
            value={`${rows[0]?.options?.length || ''}`}
            SelectProps={{
              IconComponent: (props) => <Svg {...commonSelectArrowProps} {...props} />,
            }}
            disabled={!isExpanded}
          />
        </StyledClearedButton>
      )}
    </StyledFlexTopCenter>
  );
};
