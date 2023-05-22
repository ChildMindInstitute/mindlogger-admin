import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { StyledHeader } from 'shared/features';
import { Svg, Tooltip } from 'shared/components';

import { ActivityItemsFlowHeaderProps } from './ActivityItemsFlowHeader.types';

export const ActivityItemsFlowHeader = ({
  isSticky,
  children,
  headerProps,
}: ActivityItemsFlowHeaderProps) => {
  const { t } = useTranslation('app');

  const isAddButtonDisabled = headerProps?.isAddItemFlowDisabled;

  return (
    <StyledHeader isSticky={isSticky}>
      <Box>{children}</Box>
      <Tooltip tooltipTitle={isAddButtonDisabled ? t('addActivityItemsFlowTooltip') : null}>
        <span>
          <Button
            variant="outlined"
            startIcon={<Svg id="add" />}
            onClick={headerProps?.onAddItemFlow}
            disabled={isAddButtonDisabled}
          >
            {t('addItemFlow')}
          </Button>
        </span>
      </Tooltip>
    </StyledHeader>
  );
};
