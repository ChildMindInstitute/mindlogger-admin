import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@mui/material';
import 'md-editor-rt/lib/style.css';

import { Svg } from 'shared/components';
import { StyledSvgArrowContainer } from 'shared/styles';
import { getDictionaryText } from 'shared/utils';
import { getHighlightedText, updateSelectedItemsInStorage } from 'modules/Library/utils';
import { useAppDispatch } from 'redux/store';
import { library } from 'redux/modules';

import {
  StyledItemContainer,
  StyledItemHeader,
  StyledMdEditor,
  StyledItemContent,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { renderItemContent } from './Item.utils';
import { AppletUiType, LibraryForm } from '../Applet.types';

export const Item = ({ item, appletId, activityName, activityKey, uiType, search }: ItemProps) => {
  const {
    i18n: { language },
  } = useTranslation('app');

  const { control, getValues, setValue } = useFormContext<LibraryForm>();
  const dispatch = useAppDispatch();
  const [itemVisible, setItemVisible] = useState(false);
  const selectedItems = getValues()[appletId];

  const handleSelect = async () => {
    const selectedItems = getValues()[appletId];
    const itemNamePlusActivityName = `${item.name}-${activityName}`;
    const activityNamePlusId = `${activityName}-${appletId}`;
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
    ({ itemNamePlusActivityName }) => itemNamePlusActivityName === `${item.name}-${activityName}`,
  );

  const highlightedTextHtml = search
    ? renderToString(getHighlightedText(search, item.question[language]) as JSX.Element)
    : item.question;

  return (
    <StyledItemContainer>
      <Controller
        name={appletId}
        control={control}
        render={() => (
          <Checkbox
            sx={{ width: '4rem', height: '4rem' }}
            checked={isChecked}
            onChange={handleSelect}
          />
        )}
      />
      <StyledItemHeader onClick={() => setItemVisible((prevState) => !prevState)}>
        <StyledSvgArrowContainer>
          <Svg id={itemVisible ? 'navigate-up' : 'navigate-right'} />
        </StyledSvgArrowContainer>
        <StyledMdEditor modelValue={getDictionaryText(highlightedTextHtml)} previewOnly />
      </StyledItemHeader>
      {itemVisible && <StyledItemContent>{renderItemContent(item)}</StyledItemContent>}
    </StyledItemContainer>
  );
};
