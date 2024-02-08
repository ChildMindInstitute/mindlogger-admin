import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { variables, StyledTitleSmall } from 'shared/styles';
import { page } from 'resources';

import { StyledWrapper, StyledButton, StyledContentWrapper } from './PerformanceTaskHeader.styles';
import { PerformanceTaskHeaderProps } from './PerformanceTaskHeader.types';

export const PerformanceTaskHeader = ({ isSticky }: PerformanceTaskHeaderProps) => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { trigger } = useCustomFormContext();

  const handleActivitiesClick = () => {
    trigger(['activities']);
    navigate(generatePath(page.builderAppletActivities, { appletId }));
  };

  return (
    <StyledWrapper>
      <Box sx={{ width: '20%' }}>
        <StyledButton
          onClick={handleActivitiesClick}
          startIcon={<Svg id="directory-up" width="18" height="18" />}
          variant="text"
        >
          {t('activities')}
        </StyledButton>
      </Box>
      <StyledContentWrapper>
        <Svg id="configure-filled" />
        <StyledTitleSmall color={variables.palette.primary}>{t('configure')}</StyledTitleSmall>
      </StyledContentWrapper>
      <Box sx={{ width: '20%' }} />
    </StyledWrapper>
  );
};
