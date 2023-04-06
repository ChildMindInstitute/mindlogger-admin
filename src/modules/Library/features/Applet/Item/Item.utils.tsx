import uniqueId from 'lodash.uniqueid';

import { ItemInputTypes } from 'shared/types';
import { variables, StyledBodyLarge } from 'shared/styles';
import i18n from 'i18n';

import { StyledItemContentRow, StyledItemSvg, StyledItemImage } from './Item.styles';
import { Item } from '../../AppletsCatalog/AppletsCatalog.types';
import { ItemResponseTypes } from '../../AppletsCatalog/AppletsCatalog.conts';

export const renderItemContent = (item: Item) => {
  const { t } = i18n;

  switch (item.responseType) {
    case ItemInputTypes.SingleSelection:
    case ItemInputTypes.MultipleSelection:
      return (
        <>
          {item.options?.map(({ title, image }) => (
            <StyledItemContentRow key={uniqueId()}>
              <StyledItemSvg>{ItemResponseTypes[item.responseType].icon}</StyledItemSvg>
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
          <StyledItemSvg>{ItemResponseTypes[item.responseType].icon}</StyledItemSvg>
          <StyledBodyLarge sx={{ color: variables.palette.outline }}>
            {t(ItemResponseTypes[item.responseType].title)}
          </StyledBodyLarge>
        </StyledItemContentRow>
      );
  }
};
