import uniqueId from 'lodash.uniqueid';

import { ItemResponseType } from 'shared/consts';
import { Item, SingleAndMultipleSelectItemResponseValues } from 'shared/state';
import { variables, StyledBodyLarge } from 'shared/styles';
import { getHighlightedText } from 'shared/utils';

import i18n from 'i18n';

import { StyledItemContentRow, StyledItemImage, StyledItemSvg } from './Item.styles';
import { ItemResponseTypes } from '../../AppletsCatalog/AppletsCatalog.conts';

export const renderItemContent = (item: Item, search: string) => {
  const { t } = i18n;

  switch (item.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return (
        <>
          {(item.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
            ({ text, image }) => (
              <StyledItemContentRow key={uniqueId()}>
                <StyledItemSvg>{ItemResponseTypes[item.responseType].icon}</StyledItemSvg>
                {image && <StyledItemImage src={image} alt="Option image" />}
                <StyledBodyLarge sx={{ color: variables.palette.on_surface }}>
                  {getHighlightedText(text, search)}
                </StyledBodyLarge>
              </StyledItemContentRow>
            ),
          )}
        </>
      );
    default:
      return (
        <StyledItemContentRow>
          <StyledItemSvg>{ItemResponseTypes[item.responseType].icon}</StyledItemSvg>
          <StyledBodyLarge sx={{ color: variables.palette.outline }}>
            {t(ItemResponseTypes[item.responseType].title)}
          </StyledBodyLarge>
        </StyledItemContentRow>
      );
  }
};

export const getSelector = (value1: string, value2: string) => `${value1}-${value2}`;
