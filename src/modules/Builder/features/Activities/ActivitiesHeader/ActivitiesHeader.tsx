import { useTranslation } from 'react-i18next';

import { StyledBuilderBtn } from 'shared/styles';
import { StyledHeader } from 'shared/features';
import { Svg } from 'shared/components';

import { ActivitiesHeaderProps } from './ActivitiesHeader.types';

export const ActivitiesHeader = ({ isSticky, children, headerProps }: ActivitiesHeaderProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <StyledBuilderBtn startIcon={<Svg id="add" />} onClick={headerProps?.onAddActivity}>
        {t('addActivity')}
      </StyledBuilderBtn>
    </StyledHeader>
  );
};
