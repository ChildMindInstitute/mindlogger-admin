import { useTranslation } from 'react-i18next';

import { itemsTypeIcons } from 'shared/consts';
import { ResponseType } from 'shared/state';
import { StyledBodyLarge, variables } from 'shared/styles';

import { StyledItem } from './UnsupportedItemResponse.styles';

export const UnsupportedItemResponse = ({ itemType }: { itemType: ResponseType }) => {
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
