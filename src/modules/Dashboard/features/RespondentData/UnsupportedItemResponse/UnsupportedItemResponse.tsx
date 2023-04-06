import { useTranslation } from 'react-i18next';

import { ItemResponseType, itemsTypeIcons } from 'shared/consts';
import { StyledBodyLarge, variables } from 'shared/styles';

import { StyledItem } from './UnsupportedItemResponse.styles';

export const UnsupportedItemResponse = ({ itemType }: { itemType: ItemResponseType }) => {
  const { t } = useTranslation();

  return (
    <StyledItem>
      {itemsTypeIcons[itemType]}{' '}
      <StyledBodyLarge color={variables.palette.outline}>
        {t('unsupportedResponseItem')}
      </StyledBodyLarge>
    </StyledItem>
  );
};
