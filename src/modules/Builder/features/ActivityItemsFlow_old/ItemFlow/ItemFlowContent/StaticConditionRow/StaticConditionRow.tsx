import { Skeleton, SkeletonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledTitleMedium } from 'shared/styles';

import { StaticConditionRowProps } from './StaticConditionRow.types';
import { StyledStaticConditionRow } from './StaticConditionRow.styles';

const commonSkeletonProps = {
  variant: 'rounded' as SkeletonProps['variant'],
  height: 36,
};

export const StaticConditionRow = ({ isSummary }: StaticConditionRowProps) => {
  const { t } = useTranslation('app');

  if (isSummary) {
    return (
      <StyledStaticConditionRow>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>
        <Skeleton {...commonSkeletonProps} width={100} />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <Skeleton {...commonSkeletonProps} width={100} />
      </StyledStaticConditionRow>
    );
  }

  return (
    <StyledStaticConditionRow>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <Skeleton {...commonSkeletonProps} width={210} />
      <Skeleton {...commonSkeletonProps} width={140} />
      <Skeleton {...commonSkeletonProps} width={100} />
    </StyledStaticConditionRow>
  );
};
