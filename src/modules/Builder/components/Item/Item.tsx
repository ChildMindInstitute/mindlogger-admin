import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Actions } from 'shared/components';
import {
  StyledTitleBoldMedium,
  StyledTitleBoldSmall,
  StyledTitleMedium,
  theme,
} from 'shared/styles';

import {
  StyledActions,
  StyledActivityDescription,
  StyledCol,
  StyledFlowDescription,
  StyledImg,
  StyledImgPlaceholder,
  StyledItem,
} from './Item.styles';
import { ItemProps, ItemUiType } from './Item.types';

export const Item = ({
  getActions,
  visibleByDefault,
  isInactive,
  hasStaticActions,
  uiType = ItemUiType.Activity,
  onItemClick,
  dragHandleProps,
  isDragging,
  ...props
}: ItemProps) => {
  const [visibleActions, setVisibleActions] = useState(false);
  const { t } = useTranslation('app');
  const { name, hasError, description, img, count, index, total } = props;
  const isActivityUiType = uiType === ItemUiType.Activity;

  const commonSx = isInactive ? { opacity: '0.38' } : undefined;

  const image = img ? (
    <StyledImg src={img} alt={name} sx={commonSx} />
  ) : (
    <StyledImgPlaceholder sx={commonSx} />
  );

  return (
    <StyledItem
      hasError={hasError}
      uiType={uiType}
      onMouseLeave={() => setVisibleActions(false)}
      onMouseEnter={() => setVisibleActions(true)}
      onClick={onItemClick}
      isDragging={isDragging}
    >
      {isActivityUiType && image}
      <StyledCol hasImage={isActivityUiType} sx={commonSx}>
        {index && total && (
          <StyledTitleMedium sx={{ marginBottom: theme.spacing(0.6) }}>
            {index} {t('of')} {total}
          </StyledTitleMedium>
        )}
        <StyledTitleBoldMedium>{name}</StyledTitleBoldMedium>
        <StyledActivityDescription>{description}</StyledActivityDescription>
        {count !== undefined && (
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
          sxProps={{ justifyContent: 'flex-end', pointerEvents: isDragging ? 'none' : 'auto' }}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
        />
      </StyledActions>
    </StyledItem>
  );
};
