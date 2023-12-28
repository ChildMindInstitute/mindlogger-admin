import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@mui/material';
import 'md-editor-rt/lib/style.css';

import { Svg } from 'shared/components/Svg';
import { StyledSvgArrowContainer } from 'shared/styles';
import { updateSelectedItemsInStorage } from 'modules/Library/utils';
import { useAppDispatch } from 'redux/store';
import { library } from 'redux/modules';
import { getHighlightedText, getDictionaryText } from 'shared/utils';

import {
  StyledItemContainer,
  StyledItemHeader,
  StyledItemContent,
  StyledMdPreview,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { getSelector, renderItemContent } from './Item.utils';
import { AppletUiType, LibraryForm } from '../Applet.types';

export const Item = ({
  item,
  appletId,
  activityName,
  activityKey,
  uiType,
  search,
  'data-testid': dataTestid,
}: ItemProps) => {
  const { control, getValues, setValue } = useFormContext<LibraryForm>();
  const dispatch = useAppDispatch();
  const [itemVisible, setItemVisible] = useState(false);
  const selectedItems = getValues()[appletId];

  const itemNamePlusActivityName = getSelector(item.name, activityName);
  const dictionaryText = getDictionaryText(item.question);

  const handleSelect = async () => {
    const selectedItems = getValues()[appletId];
    const activityNamePlusId = getSelector(activityName, appletId);
    const checked = !!selectedItems?.find(
      (item) => item.itemNamePlusActivityName === itemNamePlusActivityName,
    );
    const updatedSelectedItems = checked
      ? selectedItems?.filter((item) => item.itemNamePlusActivityName !== itemNamePlusActivityName)
      : [
          ...selectedItems,
          {
            itemNamePlusActivityName,
            activityNamePlusId,
            activityName,
            activityKey,
          },
        ];
    await setValue(appletId, updatedSelectedItems);

    if (uiType === AppletUiType.Cart) {
      const { isNoSelectedItems } = updateSelectedItemsInStorage(getValues(), appletId);
      dispatch(library.actions.setAddToCartBtnDisabled(isNoSelectedItems));
    }
  };

  const isChecked = !!selectedItems?.find(
    (item) => item.itemNamePlusActivityName === itemNamePlusActivityName,
  );

  const highlightedTextHtml = search
    ? renderToString(getHighlightedText(dictionaryText, search) as JSX.Element)
    : dictionaryText;

  useEffect(() => {
    setItemVisible(!!item.expanded);
  }, [item]);

  return (
    <StyledItemContainer data-testid={dataTestid}>
      <Controller
        name={appletId}
        control={control}
        render={() => (
          <Checkbox
            sx={{ width: '4rem', height: '4rem' }}
            checked={isChecked}
            onChange={handleSelect}
            data-testid={`${dataTestid}-checkbox`}
          />
        )}
      />
      <StyledItemHeader
        onClick={() => setItemVisible((prevState) => !prevState)}
        data-testid={`${dataTestid}-header`}
      >
        <StyledSvgArrowContainer>
          <Svg id={itemVisible ? 'navigate-up' : 'navigate-right'} />
        </StyledSvgArrowContainer>
        <StyledMdPreview modelValue={highlightedTextHtml} />
      </StyledItemHeader>
      {itemVisible && <StyledItemContent>{renderItemContent(item, search)}</StyledItemContent>}
    </StyledItemContainer>
  );
};
