import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';

import {
  StyledFlexColumn,
  StyledFlexSpaceBetween,
  StyledFlexTopStart,
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
} from 'shared/styles';

import { ActivitySummaryCardProps } from './ActivitySummaryCard.types';
import { StatBox } from './StatBox';
import { StyledActivityName, StyledContainer } from './ActivitySummaryCard.styles';

export const ActivitySummaryCard = ({
  activity: { id, name, image },
  actionsMenu,
  compliance,
  participantCount,
  latestActivity,
  showStats = false,
  'data-testid': dataTestId,
  onClick,
}: ActivitySummaryCardProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledContainer
      data-testid={dataTestId}
      onClick={onClick && (() => onClick({ activityId: id ?? '' }))}
    >
      <StyledFlexSpaceBetween>
        <StyledActivityThumbnailContainer>
          {!!image && <StyledActivityThumbnailImg src={image} alt={name} />}
        </StyledActivityThumbnailContainer>

        {actionsMenu}
      </StyledFlexSpaceBetween>

      <StyledFlexColumn sx={{ gap: 2.4 }}>
        <StyledFlexColumn sx={{ gap: 0.8 }}>
          <StyledActivityName>{name}</StyledActivityName>
        </StyledFlexColumn>

        {showStats && (
          <>
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
          </>
        )}
      </StyledFlexColumn>
    </StyledContainer>
  );
};
