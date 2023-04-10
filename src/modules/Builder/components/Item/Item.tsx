import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Actions } from 'shared/components';
import {
  StyledBodyLarge,
  StyledTitleBoldMedium,
  StyledTitleBoldSmall,
  StyledTitleMedium,
  theme,
} from 'shared/styles';

import { StyledActions, StyledCol, StyledImg, StyledItem } from './Item.styles';
import { ItemProps, ItemUiType } from './Item.types';

export const Item = ({
  getActions,
  visibleByDefault,
  isInactive,
  hasStaticActions,
  uiType = ItemUiType.Activity,
  onItemClick,
  ...props
}: ItemProps) => {
  const [visibleActions, setVisibleActions] = useState(false);
  const { t } = useTranslation('app');
  const { name, hasError, description, img, count, index, total } = props;
  const isFlowUiType = uiType === ItemUiType.Flow;

  const commonSx = isInactive ? { opacity: '0.38' } : undefined;

  return (
    <StyledItem
      hasError={hasError}
      uiType={uiType}
      onMouseLeave={() => setVisibleActions(false)}
      onMouseEnter={() => setVisibleActions(true)}
      onClick={onItemClick}
    >
      {img && <StyledImg src={img} alt={name} sx={commonSx} />}
      <StyledCol sx={commonSx}>
        {index && total && (
          <StyledTitleMedium sx={{ marginBottom: theme.spacing(0.6) }}>
            {index} {t('of')} {total}
          </StyledTitleMedium>
        )}
        {isFlowUiType ? (
          <>
            <StyledTitleMedium className="item-name">{name}</StyledTitleMedium>
            <StyledBodyLarge>{description}</StyledBodyLarge>
          </>
        ) : (
          <>
            <StyledTitleBoldMedium>{name}</StyledTitleBoldMedium>
            <StyledTitleMedium>{description}</StyledTitleMedium>
          </>
        )}
        {count && (
          <StyledTitleBoldSmall sx={{ marginTop: theme.spacing(0.6) }}>
            {count} {t('item', { count })}
          </StyledTitleBoldSmall>
        )}
      </StyledCol>
      <StyledActions>
        <Actions
          items={getActions()}
          context={props}
          visibleByDefault={visibleByDefault || visibleActions}
          hasStaticActions={hasStaticActions}
        />
      </StyledActions>
    </StyledItem>
  );
};
