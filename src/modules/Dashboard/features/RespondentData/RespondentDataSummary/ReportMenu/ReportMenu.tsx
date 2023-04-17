import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { users } from 'redux/modules';

import { theme, StyledHeadlineLarge, StyledLabelLarge, StyledBodyLarge } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledActivity } from './ReportMenu.styles';
import { ReportMenuProps } from './ReportMenu.types';

export const ReportMenu = ({
  activities,
  selectedActivity,
  setSelectedActivity,
}: ReportMenuProps) => {
  const { t } = useTranslation();
  const { respondentId } = useParams();
  const { secretId, nickname } = users.useRespondent(respondentId || '') || {};
  const respondentLabel = secretId ? `${t('user')}: ${secretId} (${nickname})` : '';

  return (
    <StyledMenu>
      <Box sx={{ margin: theme.spacing(0, 2.4, 3.2) }}>
        <StyledHeadlineLarge>{t('activities')}</StyledHeadlineLarge>
        <StyledLabelLarge>{respondentLabel}</StyledLabelLarge>
      </Box>
      {activities.map((activity) => (
        <StyledActivity
          key={String(activity.id)}
          isSelected={selectedActivity.id === activity.id}
          onClick={() => setSelectedActivity(activity)}
        >
          <StyledBodyLarge>{activity.name}</StyledBodyLarge>
        </StyledActivity>
      ))}
    </StyledMenu>
  );
};
