import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledBuilderContainerHeader } from 'shared/features';

import { LeftBarHeaderProps } from './LeftBarHeader.types';

export const LeftBarHeader = ({ isSticky, children, headerProps }: LeftBarHeaderProps) => {
  const { t } = useTranslation('app');

  const { hasActiveItem, onAddItem } = headerProps ?? {};

  const addItemBtn = (
    <Button
      variant="outlined"
      startIcon={<Svg id="add" width={18} height={18} />}
      onClick={onAddItem}
      data-testid="builder-activity-items-add-item">
      {t('addItem')}
    </Button>
  );

  return (
    <StyledBuilderContainerHeader isSticky={isSticky}>
      {children}
      {!hasActiveItem && addItemBtn}
    </StyledBuilderContainerHeader>
  );
};
