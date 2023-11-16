import { useTranslation } from 'react-i18next';

import { ItemResponseType, itemsTypeIcons } from 'shared/consts';
import { StyledBodyLarge, variables } from 'shared/styles';

import { StyledItem } from './UnsupportedItemResponse.styles';
import { UnsupportedItemResponseProps } from './UnsupportedItemResponse.types';

export const UnsupportedItemResponse = ({
  itemType,
  'data-testid': dataTestid,
}: UnsupportedItemResponseProps) => {
  const { t } = useTranslation();

  return (
    <StyledItem data-testid={dataTestid}>
      {itemsTypeIcons[itemType]}
      <StyledBodyLarge color={variables.palette.outline}>
        {t(
          itemType === ItemResponseType.Message
            ? 'messageDoesNotRequireResponse'
            : 'unsupportedResponseItem',
        )}
      </StyledBodyLarge>
    </StyledItem>
  );
};
