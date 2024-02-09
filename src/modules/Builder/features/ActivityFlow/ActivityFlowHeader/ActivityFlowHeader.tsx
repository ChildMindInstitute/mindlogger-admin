import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBuilderContainerHeader } from 'shared/features';
import { falseReturnFunc } from 'shared/utils';

import { ActivityFlowHeaderProps } from './ActivityFlowHeader.types';

export const ActivityFlowHeader = ({ isSticky, children, headerProps }: ActivityFlowHeaderProps) => {
  const { t } = useTranslation('app');
  const { onAddActivityFlow = falseReturnFunc } = headerProps || {};

  return (
    <StyledBuilderContainerHeader isSticky={isSticky}>
      {children}
      <Button
        variant="outlined"
        startIcon={<Svg id="flow" />}
        onClick={() => onAddActivityFlow()}
        data-testid="builder-activity-flows-add"
      >
        {t('addActivityFlow')}
      </Button>
    </StyledBuilderContainerHeader>
  );
};
