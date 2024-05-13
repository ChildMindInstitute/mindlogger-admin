import { useTranslation } from 'react-i18next';
import { Divider, Link } from '@mui/material';
import { generatePath, useParams } from 'react-router-dom';

import { StyledFlexColumn, StyledFlexSpaceBetween, StyledFlexTopStart } from 'shared/styles';
import { page } from 'resources';

import { ActivitySummaryCardProps } from './ActivitySummaryCard.types';
import {
  StyledActivityName,
  StyledContainer,
  StyledImageContainer,
  StyledImg,
} from './ActivitySummaryCard.styles';
import { StatBox } from './StatBox';

export const ActivitySummaryCard = ({
  activityId,
  actionsMenu,
  compliance,
  image,
  name,
  participantCount,
  latestActivity,
  'data-testid': dataTestId,
}: ActivitySummaryCardProps) => {
  const { t } = useTranslation('app');
  const { appletId, subjectId } = useParams();

  return (
    <Link
      underline="none"
      href={
        subjectId &&
        generatePath(page.appletParticipantActivityDetailsDataSummary, {
          appletId,
          activityId,
          subjectId,
        })
      }
    >
      <StyledContainer data-testid={dataTestId}>
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
    </Link>
  );
};
