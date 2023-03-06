import { useTranslation } from 'react-i18next';

import { StyledBuilderBtn, StyledHeadlineLarge } from 'styles/styledComponents';
import { Svg } from 'components';
import theme from 'styles/theme';

import { items } from './LeftBar.const';
import { StyledBar } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';

export const LeftBar = ({ setActiveItem, activeItem }: LeftBarProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledBar>
      <StyledHeadlineLarge sx={{ margin: theme.spacing(0, 0, 2.8, 4.8) }}>
        {t('items')}
      </StyledHeadlineLarge>
      {items.map((item) => (
        <Item key={item.id} {...item} activeItem={activeItem} setActiveItem={setActiveItem} />
      ))}
      <StyledBuilderBtn
        sx={{ margin: theme.spacing(1.6, 'auto', 0), display: 'flex' }}
        startIcon={<Svg id="add" width={18} height={18} />}
      >
        {t('addItem')}
      </StyledBuilderBtn>
    </StyledBar>
  );
};
