import { useTranslation } from 'react-i18next';

import { ItemResponseType } from 'shared/consts';
import { Item } from 'shared/state';
import { variables, StyledBodyLarge } from 'shared/styles';
import { getHighlightedText } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { StyledItemContentRow, StyledItemImage, StyledItemSvg } from './Item.styles';
import { getItemResponseTypes } from '../../AppletsCatalog/AppletsCatalog.utils';

export const useItemContent = () => {
  const { t } = useTranslation('app');
  const {
    featureFlags: { enableParagraphTextItem },
  } = useFeatureFlags();
  const itemResponseTypes = getItemResponseTypes(!!enableParagraphTextItem);

  return (item: Item, search: string) => {
    switch (item.responseType) {
      case ItemResponseType.SingleSelection:
      case ItemResponseType.MultipleSelection:
        return (
          <>
            {item.responseValues?.options?.map(({ text, image }, index) => (
              <StyledItemContentRow key={index} data-testid={`item-option-${index}`}>
                <StyledItemSvg>{itemResponseTypes[item.responseType].icon}</StyledItemSvg>
                {image && <StyledItemImage src={image} alt="Option image" />}
                <StyledBodyLarge sx={{ color: variables.palette.on_surface }}>
                  {getHighlightedText(text, search)}
                </StyledBodyLarge>
              </StyledItemContentRow>
            ))}
          </>
        );
      default:
        return (
          <StyledItemContentRow>
            <StyledItemSvg>{itemResponseTypes[item.responseType].icon}</StyledItemSvg>
            <StyledBodyLarge
              sx={{ color: variables.palette.outline }}
              data-testid={'item-option-title'}
            >
              {t(itemResponseTypes[item.responseType].title)}
            </StyledBodyLarge>
          </StyledItemContentRow>
        );
    }
  };
};
