import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { EmptyState } from 'shared/components';
import { StyledFlexWrap } from 'shared/styles';
import { ActivitySummaryCard } from 'modules/Dashboard/components';

import { ActivityGridProps } from './ActivityGrid.types';

export const ActivityGrid = ({
  rows,
  TakeNowModal,
  'data-testid': dataTestId,
  onClickItem,
}: ActivityGridProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();

  const isEmpty = !rows?.length;

  const getEmptyComponent = () => {
    if (isEmpty) {
      return appletId ? t('noActivitiesForApplet') : t('noActivities');
    }
  };

  if (isEmpty) {
    return <EmptyState>{getEmptyComponent()}</EmptyState>;
  }

  return (
    <>
      {!!rows?.length && (
        <StyledFlexWrap sx={{ gap: 2.4 }} data-testid={`${dataTestId}-grid`}>
          {rows.map((activity) => (
            <ActivitySummaryCard
              key={String(activity.id.value)}
              activity={{
                id: String(activity.id.value),
                name: String(activity.name.value),
                image: String(activity.image.value),
              }}
              actionsMenu={activity.actions.content?.()}
              compliance={activity.compliance.content?.()}
              participantCount={activity.participantCount.content?.()}
              latestActivity={activity.latestActivity.content?.()}
              data-testid={`${dataTestId}-activity-card`}
              onClick={onClickItem}
            />
          ))}
        </StyledFlexWrap>
      )}

      <TakeNowModal />
    </>
  );
};

export default ActivityGrid;
