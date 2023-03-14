import uniqueId from 'lodash.uniqueid';

import { StyledBodyLarge } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';
import i18n from 'i18n';

import { StyledItemContentRow, StyledItemSvg, StyledItemImage } from './Item.styles';
import { Item, ItemResponseType } from '../../AppletsCatalog/AppletsCatalog.types';
import { itemResponseTypes } from '../../AppletsCatalog/AppletsCatalog.conts';

export const renderItemContent = (item: Item) => {
  const { t } = i18n;

  switch (item.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return (
        <>
          {item.options?.map(({ title, image }) => (
            <StyledItemContentRow key={uniqueId()}>
              <StyledItemSvg>{itemResponseTypes[item.responseType].icon}</StyledItemSvg>
              {image && <StyledItemImage src={image} alt="Option image" />}
              <StyledBodyLarge sx={{ color: variables.palette.on_surface }}>
                {title}
              </StyledBodyLarge>
            </StyledItemContentRow>
          ))}
        </>
      );
    default:
      return (
        <StyledItemContentRow>
          <StyledItemSvg>{itemResponseTypes[item.responseType].icon}</StyledItemSvg>
          <StyledBodyLarge sx={{ color: variables.palette.outline }}>
            {t(itemResponseTypes[item.responseType].title)}
          </StyledBodyLarge>
        </StyledItemContentRow>
      );
  }
};
