import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { getEmptySelectionItem } from 'modules/Builder/features/ActivityItems/ItemConfiguration';
import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles';

import { Header } from './Header';
import { Options } from './Options';
import { Items } from './Items';
import { StyledSelectionRowsContainer, StyledAddRowButton } from './SelectionRows.styles';
import { SelectionRowsProps } from './SelectionRows.types';

export const SelectionRows = ({ isSingle }: SelectionRowsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation('app');

  const { watch, setValue } = useFormContext();

  const items = watch('selectionRows.items');
  const options = watch('selectionRows.options');

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const handleAddRow = () => {
    setValue('selectionRows.items', [...items, getEmptySelectionItem(options.length)]);
  };

  return (
    <StyledSelectionRowsContainer in={isExpanded} collapsedSize="9.2rem" timeout={0}>
      <StyledFlexColumn sx={{ gap: '2.4rem' }}>
        <Header isSingle={isSingle} isExpanded={isExpanded} onArrowClick={handleCollapse} />
        <StyledFlexColumn>
          <Options />
          <Items isSingle={isSingle} />
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
