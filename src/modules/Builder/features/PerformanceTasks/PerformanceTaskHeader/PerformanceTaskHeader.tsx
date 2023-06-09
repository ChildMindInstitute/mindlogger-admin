import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles';
import { page } from 'resources';

import { StyledWrapper, StyledButton } from './PerformanceTaskHeader.styles';

export const PerformanceTaskHeader = () => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { trigger } = useFormContext();

  const handleActivitiesClick = () => {
    trigger(['activities']);
    navigate(generatePath(page.builderAppletActivities, { appletId }));
  };

  return (
    <StyledWrapper>
      <Box sx={{ width: '30%' }}>
        <StyledButton
          onClick={handleActivitiesClick}
          startIcon={<Svg id="add" width="18" height="18" />}
          variant="text"
        >
          {t('activities')}
        </StyledButton>
      </Box>
      <StyledFlexColumn sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg id="placeholder" />
        <StyledTitleSmall>{t('items')}</StyledTitleSmall>
      </StyledFlexColumn>
      <Box sx={{ width: '30%' }} />
    </StyledWrapper>
  );
};
