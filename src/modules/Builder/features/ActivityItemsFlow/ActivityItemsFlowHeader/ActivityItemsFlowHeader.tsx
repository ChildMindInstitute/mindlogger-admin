import { useTranslation } from 'react-i18next';

import { StyledHeader } from 'shared/features';
import { Svg, Tooltip } from 'shared/components';

import { ActivityItemsFlowHeaderProps } from './ActivityItemsFlowHeader.types';
import { StyledAddItemFlowBtn } from './ActivityItemsFlowHeader.styles';

export const ActivityItemsFlowHeader = ({
  isSticky,
  children,
  headerProps,
}: ActivityItemsFlowHeaderProps) => {
  const { t } = useTranslation('app');

  const isAddButtonDisabled = headerProps?.isAddItemFlowDisabled;

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <Tooltip tooltipTitle={isAddButtonDisabled ? t('addActivityItemsFlowTooltip') : null}>
        <span>
          <StyledAddItemFlowBtn
            startIcon={<Svg id="add" />}
            onClick={headerProps?.onAddItemFlow}
            disabled={isAddButtonDisabled}
          >
            {t('addItemFlow')}
          </StyledAddItemFlowBtn>
        </span>
      </Tooltip>
    </StyledHeader>
  );
};
