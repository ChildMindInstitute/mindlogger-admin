import { useTranslation } from 'react-i18next';

import { StyledBuilderBtn } from 'shared/styles';
import { StyledHeader } from 'shared/features';
import { Svg } from 'shared/components';
import { ActivityFlowHeaderProps } from './ActivityFlowHeader.types';

export const ActivityFlowHeader = ({
  isSticky,
  children,
  headerProps,
}: ActivityFlowHeaderProps) => {
  const { t } = useTranslation('app');
  const { onAddActivityFlow = () => false } = headerProps || {};

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <StyledBuilderBtn startIcon={<Svg id="flow" />} onClick={() => onAddActivityFlow()}>
        {t('addActivityFlow')}
      </StyledBuilderBtn>
    </StyledHeader>
  );
};
