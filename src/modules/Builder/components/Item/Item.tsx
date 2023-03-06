import { useTranslation } from 'react-i18next';

import { Actions } from 'components';
import {
  StyledTitleBoldMedium,
  StyledTitleMedium,
  StyledTitleBoldSmall,
} from 'styles/styledComponents';
import theme from 'styles/theme';

import { StyledItem, StyledImg, StyledCol, StyledActions } from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({ getActions, ...props }: ItemProps) => {
  const { t } = useTranslation('app');
  const { name, description, img, count, withHover, index, total } = props;

  return (
    <StyledItem withHover={withHover}>
      {img && <StyledImg src={img} alt={name} />}
      <StyledCol>
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
        <Actions items={getActions()} context={props} />
      </StyledActions>
    </StyledItem>
  );
};
