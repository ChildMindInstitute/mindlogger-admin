import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';

import { StyledFlexColumn, StyledFlexSpaceBetween, StyledFlexTopStart } from 'shared/styles';

import { StatBox } from './StatBox';
import {
  StyledActivityName,
  StyledContainer,
  StyledImageContainer,
  StyledImg,
} from './ActivitySummaryCard.styles';
import { ActivitySummaryCardProps } from './ActivitySummaryCard.types';

export const ActivitySummaryCard = ({
  activityId,
  actionsMenu,
  compliance,
  image,
  name,
  participantCount,
  latestActivity,
  'data-testid': dataTestId,
  onClick,
}: ActivitySummaryCardProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledContainer
      data-testid={dataTestId}
      onClick={onClick ? () => onClick(activityId || '') : undefined}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <StyledFlexSpaceBetween>
        <StyledImageContainer>
          {!!image && <StyledImg src={image} alt={name} />}
        </StyledImageContainer>

        {actionsMenu}
      </StyledFlexSpaceBetween>

      <StyledFlexColumn sx={{ gap: 2.4 }}>
        <StyledFlexColumn sx={{ gap: 0.8 }}>
          <StyledActivityName>{name}</StyledActivityName>
        </StyledFlexColumn>

        <Divider />

        <StyledFlexColumn sx={{ gap: 1.6 }}>
          <StyledFlexTopStart sx={{ gap: 2.4 }}>
            <StatBox label={t('participants')} sx={{ flex: 1 }}>
              {participantCount}
            </StatBox>

            <StatBox label={t('compliance')} sx={{ flex: 1 }}>
              {compliance}
            </StatBox>
          </StyledFlexTopStart>

          <StatBox label={t('latestActivity')}>{latestActivity}</StatBox>
        </StyledFlexColumn>
      </StyledFlexColumn>
    </StyledContainer>
  );
};
