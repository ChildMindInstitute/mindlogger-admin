import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles';
import { SingleAndMultiSelectRowOption } from 'shared/state';

import { Header } from './Header';
import { Options } from './Options';
import { Items } from './Items';
import { StyledSelectionRowsContainer, StyledAddRowButton } from './SelectionRows.styles';
import { SelectionRowsProps } from './SelectionRows.types';
import { getEmptySelectionItem } from '../../ItemConfiguration.utils';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE } from '../../ItemConfiguration.const';

export const SelectionRows = ({ name, isSingle }: SelectionRowsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation('app');

  const { watch, setValue, getValues } = useFormContext();

  const rowsName = `${name}.responseValues.rows`;
  const rows = watch(rowsName);
  const settings = watch(`${name}.config`);
  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const handleAddRow = () => {
    const newRow = getEmptySelectionItem();
    const options = getValues(`${name}.responseValues.options`);
    const dataMatrix = getValues(`${name}.responseValues.dataMatrix`);
    setValue(`${name}.responseValues.rows`, [...rows, newRow]);

    if (hasScores || hasAlerts) {
      setValue(`${name}.responseValues.dataMatrix`, [
        ...dataMatrix,
        {
          rowId: newRow.id,
          options: options?.map((option: SingleAndMultiSelectRowOption) => ({
            optionId: option.id,
            ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
          })),
        },
      ]);
    }
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
