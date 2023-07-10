import uniqueId from 'lodash.uniqueid';

import { ItemResponseType } from 'shared/consts';
import { PublishedItem } from 'redux/modules';
import { variables, StyledBodyLarge } from 'shared/styles';
import i18n from 'i18n';

import { StyledItemContentRow, StyledItemSvg } from './Item.styles';
import { ItemResponseTypes } from '../../AppletsCatalog/AppletsCatalog.conts';

export const renderItemContent = (item: PublishedItem) => {
  const { t } = i18n;

  switch (item.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return (
        <>
          {item.responseValues?.map((value) => (
            <StyledItemContentRow key={uniqueId()}>
              <StyledItemSvg>{ItemResponseTypes[item.responseType].icon}</StyledItemSvg>
              <StyledBodyLarge sx={{ color: variables.palette.on_surface }}>
                {value}
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
