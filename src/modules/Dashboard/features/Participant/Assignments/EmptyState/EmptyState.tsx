import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledHeadlineSmall,
  variables,
} from 'shared/styles';

import { EmptyStateProps } from './EmptyState.types';

export const EmptyState = ({
  icon,
  title,
  onClickAssign,
  maxWidth = '50.7rem',
  dataTestId,
}: EmptyStateProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });

  return (
    <StyledFlexAllCenter
      sx={{ flexDirection: 'column', flex: 1, m: 'auto', textAlign: 'center' }}
      data-testid={`${dataTestId}-empty-state`}
    >
      <StyledFlexColumn sx={{ alignItems: 'center', gap: 1.6, maxWidth }}>
        <Svg id={icon} width="80" height="80" fill={variables.palette.outline} />
        <StyledHeadlineSmall as="h2" color={variables.palette.outline} sx={{ m: 0 }}>
          {title}
        </StyledHeadlineSmall>
      </StyledFlexColumn>
      {!!onClickAssign && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onClickAssign()}
          sx={{ mt: 2.4 }}
        >
          {t('assignActivityButton')}
        </Button>
      )}
    </StyledFlexAllCenter>
  );
};
