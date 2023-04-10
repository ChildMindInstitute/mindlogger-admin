import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'shared/components';
import { SelectEvent } from 'shared/types/event';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  variables,
  theme,
} from 'shared/styles';
import { createArray } from 'shared/utils';

import { StyledSelectController } from './Header.styles';
import { HeaderProps } from './Header.types';
import { getMultipleSelectionRowsOptions } from './Header.utils';
import {
  DEFAULT_EMPTY_SELECTION_ROWS_OPTION,
  DEFAULT_SELECTION_ROWS_SCORE,
} from '../../../ItemConfiguration.const';
import { SelectionRowsItem } from '../../../ItemConfiguration.types';

const commonSelectArrowProps = {
  id: 'navigate-down',
  sx: {
    fill: variables.palette.primary,
  },
};

const commonButtonProps = {
  sx: { p: theme.spacing(1) },
};

export const Header = ({ isSingle, isExpanded, onArrowClick }: HeaderProps) => {
  const { t } = useTranslation('app');

  const { watch, getValues, setValue } = useFormContext();

  const options = watch('selectionRows.options');

  const handleChange = (e: SelectEvent) => {
    const options = getValues('selectionRows.options');
    const items = getValues('selectionRows.items');

    if (+e.target.value < options.length) {
      setValue('selectionRows.options.length', +e.target.value);
      setValue(
        'selectionRows.items',
        items?.map((item: SelectionRowsItem) => ({
          ...item,
          scores: item?.scores?.slice(0, +e.target.value),
        })),
      );
    } else {
      setValue('selectionRows.options', [
        ...options,
        ...createArray(+e.target.value - options.length, () => ({
          ...DEFAULT_EMPTY_SELECTION_ROWS_OPTION,
          id: uniqueId('selection-option-'),
        })),
      ]);
      setValue(
        'selectionRows.items',
        items?.map((item: SelectionRowsItem) => ({
          ...item,
          scores: [
            ...(item?.scores || []),
            ...createArray(+e.target.value - options.length, () => DEFAULT_SELECTION_ROWS_SCORE),
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
            value={`${options?.length || ''}`}
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
