import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles';
import { SingleAndMultipleSelectRow, SingleAndMultipleSelectRowOption } from 'shared/state';

import { Header } from './Header';
import { Options } from './Options';
import { Items } from './Items';
import { StyledSelectionRowsContainer, StyledAddRowButton } from './SelectionRows.styles';
import { SelectionRowsProps } from './SelectionRows.types';
import { getEmptySelectionItem } from '../../ItemConfiguration.utils';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { DEFAULT_SELECTION_ROWS_SCORE } from '../../ItemConfiguration.const';

export const SelectionRows = ({ name, isSingle }: SelectionRowsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation('app');

  const { watch, setValue, getValues } = useFormContext();

  const rowsName = `${name}.responseValues.rows`;
  const rows = watch(rowsName);
  const setting = watch(`${name}.config`);

  const hasScores = get(setting, ItemConfigurationSettings.HasScores);

  useEffect(() => {
    const rows = getValues(`${rowsName}`);

    rows.forEach(({ options }: SingleAndMultipleSelectRow, rowIndex: number) => {
      options.forEach((option: SingleAndMultipleSelectRowOption, optionIndex) => {
        setValue(`${rowsName}.${rowIndex}.options.${optionIndex}`, {
          ...option,
          score: hasScores ? option.score ?? DEFAULT_SELECTION_ROWS_SCORE : undefined,
        });
      });
    });
  }, [hasScores]);

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const handleAddRow = () => {
    setValue(`${name}.responseValues.rows`, [
      ...rows,
      {
        ...getEmptySelectionItem(rows[0]?.options?.length, hasScores),
        options: rows[0].options.map((option: SingleAndMultipleSelectRowOption) => ({
          ...option,
          id: uuidv4(),
        })),
      },
    ]);
  };

  return (
    <StyledSelectionRowsContainer in={isExpanded} collapsedSize="9.2rem" timeout={0}>
      <StyledFlexColumn sx={{ gap: '2.4rem' }}>
        <Header
          name={name}
          isSingle={isSingle}
          isExpanded={isExpanded}
          onArrowClick={handleCollapse}
        />
        <StyledFlexColumn>
          <Options name={name} />
          <Items name={name} isSingle={isSingle} />
        </StyledFlexColumn>
        <StyledAddRowButton
          onClick={handleAddRow}
          variant="outlined"
          startIcon={<Svg id="add" width="20" height="20" />}
        >
          {t('addSelectionRow')}
        </StyledAddRowButton>
      </StyledFlexColumn>
    </StyledSelectionRowsContainer>
  );
};
