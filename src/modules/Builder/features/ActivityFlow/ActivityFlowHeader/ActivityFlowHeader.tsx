import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { StyledHeader } from 'shared/features';
import { Svg } from 'shared/components/Svg';
import { falseReturnFunc } from 'shared/utils';

import { ActivityFlowHeaderProps } from './ActivityFlowHeader.types';

export const ActivityFlowHeader = ({
  isSticky,
  children,
  headerProps,
}: ActivityFlowHeaderProps) => {
  const { t } = useTranslation('app');
  const { onAddActivityFlow = falseReturnFunc } = headerProps || {};

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <Button
        variant="outlined"
        startIcon={<Svg id="flow" />}
        onClick={() => onAddActivityFlow()}
        data-testid="builder-activity-flows-add"
      >
        {t('addActivityFlow')}
      </Button>
    </StyledHeader>
  );
};
