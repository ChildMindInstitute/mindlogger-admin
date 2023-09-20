import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { StyledHeader } from 'shared/features';
import { Svg } from 'shared/components';

import { LeftBarHeaderProps } from './LeftBarHeader.types';

export const LeftBarHeader = ({ isSticky, children, headerProps }: LeftBarHeaderProps) => {
  const { t } = useTranslation('app');

  const { hasActiveItem, onAddItem } = headerProps ?? {};

  const addItemBtn = (
    <Button
      variant="outlined"
      startIcon={<Svg id="add" width={18} height={18} />}
      onClick={onAddItem}
      data-testid="builder-activity-items-add-item"
    >
      {t('addItem')}
    </Button>
  );

  return (
    <StyledHeader isSticky={isSticky} sx={{ maxHeight: '9.6rem' }}>
      {children}
      {!hasActiveItem && addItemBtn}
    </StyledHeader>
  );
};
