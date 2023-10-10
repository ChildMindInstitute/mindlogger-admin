import { Skeleton, SkeletonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledFlexTopCenter, StyledTitleMedium } from 'shared/styles';

import { StaticConditionRowProps } from './StaticConditionRow.types';

const commonSxProps = {
  gap: '0.4rem',
  height: '5.2rem',
};
const commonSkeletonProps = {
  variant: 'rounded' as SkeletonProps['variant'],
  height: 36,
};

export const StaticConditionRow = ({ isSummary }: StaticConditionRowProps) => {
  const { t } = useTranslation('app');

  if (isSummary)
    return (
      <StyledFlexTopCenter sx={commonSxProps}>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>
        <Skeleton {...commonSkeletonProps} width={100} />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <Skeleton {...commonSkeletonProps} width={100} />
      </StyledFlexTopCenter>
    );

  return (
    <StyledFlexTopCenter sx={commonSxProps}>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <Skeleton {...commonSkeletonProps} width={210} />
      <Skeleton {...commonSkeletonProps} width={140} />
      <Skeleton {...commonSkeletonProps} width={100} />
    </StyledFlexTopCenter>
  );
};
