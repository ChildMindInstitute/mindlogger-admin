import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledFlexAllCenter, StyledFlexColumn, StyledHeadline, variables } from 'shared/styles';

import { EmptyStateProps } from './EmptyState.types';

export const EmptyState = ({ icon, title, onClickAssign }: EmptyStateProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });

  return (
    <StyledFlexAllCenter sx={{ flexDirection: 'column', flex: 1, m: 'auto', textAlign: 'center' }}>
      <StyledFlexColumn sx={{ alignItems: 'center', gap: 1.6, maxWidth: '50.7rem' }}>
        <Svg id={icon} width="80" height="80" fill={variables.palette.outline} />
        <StyledHeadline as="h2" sx={{ color: variables.palette.outline, m: 0 }}>
          {title}
        </StyledHeadline>
      </StyledFlexColumn>
      {!!onClickAssign && (
        <Button variant="contained" color="primary" onClick={onClickAssign} sx={{ mt: 2.4 }}>
          {t('assignActivityButton')}
        </Button>
      )}
    </StyledFlexAllCenter>
  );
};