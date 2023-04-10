import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Actions } from 'shared/components';
import {
  theme,
  StyledTitleBoldMedium,
  StyledTitleMedium,
  StyledTitleBoldSmall,
} from 'shared/styles';

import { StyledItem, StyledImg, StyledCol, StyledActions } from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({
  getActions,
  visibleByDefault,
  isInactive,
  hasStaticActions,
  ...props
}: ItemProps) => {
  const [visibleActions, setVisibleActions] = useState(false);
  const { t } = useTranslation('app');
  const { name, hasError, description, img, count, withHover, index, total } = props;

  const commonSx = isInactive ? { opacity: '0.38' } : undefined;

  return (
    <StyledItem
      withHover={withHover}
      hasError={hasError}
      onMouseLeave={() => setVisibleActions(false)}
      onMouseEnter={() => setVisibleActions(true)}
    >
      {img && <StyledImg src={img} alt={name} sx={commonSx} />}
      <StyledCol sx={commonSx}>
        {index && total && (
          <StyledTitleMedium sx={{ marginBottom: theme.spacing(0.6) }}>
            {index} {t('of')} {total}
          </StyledTitleMedium>
        )}
        <StyledTitleBoldMedium>{name}</StyledTitleBoldMedium>
        <StyledTitleMedium>{description}</StyledTitleMedium>
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
