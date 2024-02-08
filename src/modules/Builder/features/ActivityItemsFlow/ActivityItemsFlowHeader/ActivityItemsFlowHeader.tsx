import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg, Tooltip } from 'shared/components';
import { StyledBuilderContainerHeader } from 'shared/features/BuilderContainer';

import { ActivityItemsFlowHeaderProps } from './ActivityItemsFlowHeader.types';

export const ActivityItemsFlowHeader = ({ isSticky, children, headerProps }: ActivityItemsFlowHeaderProps) => {
  const { t } = useTranslation('app');

  const isAddButtonDisabled = headerProps?.isAddItemFlowDisabled;

  return (
    <StyledBuilderContainerHeader isSticky={isSticky}>
      <Box>{children}</Box>
      <Tooltip tooltipTitle={isAddButtonDisabled ? t('addActivityItemsFlowTooltip') : null}>
        <span>
          <Button
            variant="outlined"
            startIcon={<Svg id="add" />}
            onClick={headerProps?.onAddItemFlow}
            disabled={isAddButtonDisabled}
            data-testid="builder-activity-item-flow-add">
            {t('addItemFlow')}
          </Button>
        </span>
      </Tooltip>
    </StyledBuilderContainerHeader>
  );
};
