import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ButtonWithMenu, EmptyState, Spinner, Svg } from 'shared/components';
import { StyledBody, StyledFlexTopCenter, StyledFlexWrap } from 'shared/styles';
import { page } from 'resources';
import { ActivitySummaryCard } from 'modules/Dashboard/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { StyledButton } from './ActivityGrid.styles';
import { ActivityGridProps } from './ActivityGrid.types';

export const ActivityGrid = ({
  isLoading = false,
  rows,
  TakeNowModal,
  'data-testid': dataTestId,
}: ActivityGridProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const { featureFlags } = useFeatureFlags();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isEmpty = !rows?.length && !isLoading;

  const getEmptyComponent = () => {
    if (isEmpty) {
      return appletId ? t('noActivitiesForApplet') : t('noActivities');
    }
  };

  return (
    <StyledBody>
      {isLoading && <Spinner />}

      <StyledFlexWrap sx={{ gap: 1.2, mb: 2.4 }}>
        {appletId && (
          <>
            {featureFlags.enableActivityFilterSort && (
              <StyledFlexTopCenter sx={{ gap: 1.2 }}>
                <StyledButton
                  variant="outlined"
                  startIcon={<Svg width={18} height={18} id="slider-rows" />}
                  // TODO: Implement filters
                  // https://mindlogger.atlassian.net/browse/M2-5530
                  onClick={() => alert('TODO: filters')}
                  data-testid={`${dataTestId}-filters`}
                >
                  {t('filters')}
                </StyledButton>

                <ButtonWithMenu
                  variant="outlined"
                  label={t('sortBy')}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  // TODO: Implement sorting
                  // https://mindlogger.atlassian.net/browse/M2-5445
                  menuItems={[
                    {
                      title: 'TODO: Sort options',
                      action: () => alert('TODO: Sort options'),
                    },
                  ]}
                  startIcon={<></>}
                  data-testid={`${dataTestId}-sort-by`}
                />
              </StyledFlexTopCenter>
            )}

            <StyledFlexWrap sx={{ gap: 1.2, ml: 'auto' }}>
              {featureFlags.enableActivityAssign && (
                <StyledButton
                  // TODO: Replace with missing `tonal` button variant as shown in Figma
                  // https://mindlogger.atlassian.net/browse/M2-6071
                  variant="outlined"
                  // TODO: Implement assign
                  // https://mindlogger.atlassian.net/browse/M2-5710
                  onClick={() => alert('TODO: Assign activity')}
                  data-testid={`${dataTestId}-assign`}
                  sx={{ minWidth: '10rem' }}
                >
                  {t('assign')}
                </StyledButton>
              )}

              <StyledButton
                variant="contained"
                onClick={() => navigate(generatePath(page.builderAppletActivities, { appletId }))}
                data-testid={`${dataTestId}-add-activity`}
                sx={{ minWidth: '13.2rem' }}
              >
                {t('addActivity')}
              </StyledButton>
            </StyledFlexWrap>
          </>
        )}
      </StyledFlexWrap>

      {!!rows?.length && (
        <StyledFlexWrap sx={{ gap: 2.4, overflowY: 'auto' }} data-testid={`${dataTestId}-grid`}>
          {rows.map((activity, index) => (
            <ActivitySummaryCard
              key={index}
              name={String(activity.name.value)}
              image={String(activity.image.value)}
              actionsMenu={activity.actions.content()}
              compliance={activity.compliance.content()}
              participantCount={activity.participantCount.content()}
              latestActivity={activity.latestActivity.content()}
              data-testid={`${dataTestId}-activity-card`}
            />
          ))}
        </StyledFlexWrap>
      )}

      {isEmpty && <EmptyState>{getEmptyComponent()}</EmptyState>}
      <TakeNowModal />
    </StyledBody>
  );
};

export default ActivityGrid;
