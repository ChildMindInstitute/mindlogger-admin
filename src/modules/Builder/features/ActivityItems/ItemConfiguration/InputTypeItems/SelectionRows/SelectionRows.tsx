import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles';

import { Header } from './Header';
import { Options } from './Options';
import { Items } from './Items';
import { StyledSelectionRowsContainer, StyledAddRowButton } from './SelectionRows.styles';
import { SelectionRowsProps } from './SelectionRows.types';
import { getEmptySelectionItem } from '../../ItemConfiguration.utils';

export const SelectionRows = ({ name, isSingle }: SelectionRowsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation('app');

  const { watch, setValue } = useFormContext();

  const rowsName = `${name}.responseValues.rows`;
  const rows = watch(rowsName);

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const handleAddRow = () => {
    setValue(`${name}.responseValues.rows`, [...rows, getEmptySelectionItem()]);
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
