import { useTranslation } from 'react-i18next';

import { Actions } from 'components';
import {
  StyledTitleBoldMedium,
  StyledTitleMedium,
  StyledTitleBoldSmall,
} from 'styles/styledComponents';
import theme from 'styles/theme';

import { StyledBuilderItem, StyledImg, StyledCol, StyledActions } from './BuilderItem.styles';
import { BuilderItemProps } from './BuilderItem.types';

export const BuilderItem = ({ getActions, ...props }: BuilderItemProps) => {
  const { t } = useTranslation('app');
  const { name, description, img, count, withHover } = props;

  return (
    <StyledBuilderItem withHover={withHover}>
      {img && <StyledImg src={img} alt={name} />}
      <StyledCol>
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
    </StyledBuilderItem>
  );
};
