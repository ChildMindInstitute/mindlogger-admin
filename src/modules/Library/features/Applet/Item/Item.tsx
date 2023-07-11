import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import 'md-editor-rt/lib/style.css';
import { Checkbox } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledSvgArrowContainer } from 'shared/styles';
import { getDictionaryText } from 'shared/utils';

import {
  StyledItemContainer,
  StyledItemHeader,
  StyledMdEditor,
  StyledItemContent,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { renderItemContent } from './Item.utils';
import { LibraryForm } from '../Applet.types';

export const Item = ({ item, appletId, activityName }: ItemProps) => {
  const { control, getValues, setValue } = useFormContext<LibraryForm>();
  const [itemVisible, setItemVisible] = useState(false);

  const handleSelect = () => {
    const selectedItems = getValues()[appletId];
    const checked = !!selectedItems?.find(({ name }) => name === item.name);
    const updatedSelectedItems = checked
      ? selectedItems?.filter(({ name }) => name !== item.name)
      : [
          ...selectedItems,
          {
            name: item.name,
            activityName,
          },
        ];
    setValue(appletId, updatedSelectedItems);
  };

  return (
    <StyledItemContainer>
      <Controller
        name={appletId}
        control={control}
        render={() => (
          <Checkbox
            sx={{ width: '4rem', height: '4rem' }}
            checked={!!getValues()[appletId].find(({ name }) => name === item.name)}
            onChange={handleSelect}
          />
        )}
      />
      <StyledItemHeader onClick={() => setItemVisible((prevState) => !prevState)}>
        <StyledSvgArrowContainer>
          <Svg id={itemVisible ? 'navigate-up' : 'navigate-right'} />
        </StyledSvgArrowContainer>
        <StyledMdEditor modelValue={getDictionaryText(item.question)} previewOnly />
      </StyledItemHeader>
      {itemVisible && <StyledItemContent>{renderItemContent(item)}</StyledItemContent>}
    </StyledItemContainer>
  );
};
