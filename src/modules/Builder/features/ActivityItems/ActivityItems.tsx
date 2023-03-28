import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledContainer } from 'shared/styles';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';

export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItem, setActiveItem] = useState('');

  useBreadcrumbs([
    {
      icon: <Svg id="item-outlined" width="18" height="18" />,
      label: t('items'),
    },
  ]);

  return (
    <StyledContainer>
      <LeftBar setActiveItem={setActiveItem} activeItem={activeItem} />
      <ItemConfiguration />
    </StyledContainer>
  );
};
