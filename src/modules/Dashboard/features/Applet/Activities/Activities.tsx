import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import {
  ActionsMenu,
  ButtonWithMenu,
  Spinner,
  Svg,
  MenuActionProps,
  EmptyState,
  Row,
} from 'shared/components';
import { StyledBody, StyledFlexTopCenter, StyledFlexWrap } from 'shared/styles';
import { getAppletActivitiesApi } from 'api';
import { useAsync, useTable } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { page } from 'resources';
import { Activity } from 'redux/modules';
import { ActivitySummaryCard } from 'modules/Dashboard/components';

import { StyledButton, StyledSearch, StyledSvg } from './Activities.styles';
import { ActivitiesData, ActivityActionProps } from './Activities.types';
import { getActivityActions } from './Activities.utils';

export const Activities = () => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dataTestid = 'dashboard-applet-activities';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { execute: getActivities } = useAsync(
    getAppletActivitiesApi,
    (response) => {
      const activitiesDetails = response?.data.result.activitiesDetails;

      return setActivitiesData({ result: activitiesDetails, count: activitiesDetails.length });
    },
    undefined,
    () => setIsLoading(false),
  );

  const { handleSearch, handleReload, searchValue } = useTable(async ({ params }) => {
    if (!appletId) return;

    setIsLoading(true);
    await getActivities({
      params: {
        ...params,
        appletId,
      },
    });
  });

  const actions = useMemo(
    () => ({
      editActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};
        // TODO: Implement edit
        // https://mindlogger.atlassian.net/browse/M2-5590
        alert(`TODO: Edit activity (${activityId})`);
      },
      exportData: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};
        // TODO: Implement export data
        // https://mindlogger.atlassian.net/browse/M2-6039
        alert(`TODO: Export data (${activityId})`);
      },
      assignActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};
        // TODO: Implement assign
        // https://mindlogger.atlassian.net/browse/M2-5710
        alert(`TODO: Assign activity (${activityId})`);
      },
      takeNow: ({ context }: MenuActionProps<ActivityActionProps>) => {
        // TODO: Implement Take Now
        // https://mindlogger.atlassian.net/browse/M2-5711
        const { activityId } = context || {};
        alert(`TODO: Take now (${activityId})`);
      },
    }),
    [],
  );

  const formatRow = useCallback(
    (activity: Activity): Row => {
      const activityId = String(activity.id);
      const name = activity.name;
      const image = String(activity.image);

      // TODO: Populate with data from BE when available
      // (Jira ticket(s) still being drafted)
      const participantCount: number | null = null;
      const compliance: number | null = null;
      const trending: 'up' | 'down' | null = null;
      const lastCompleted: string | null = null;

      return {
        image: {
          content: () => image,
          value: image,
        },
        name: {
          content: () => name,
          value: name,
        },
        participantCount: {
          content: () => participantCount,
          value: Number(participantCount),
        },
        lastCompleted: {
          content: () =>
            !!lastCompleted &&
            format(new Date(String(lastCompleted)), DateFormats.MonthDayYearTime),
          value: String(lastCompleted),
        },
        compliance: {
          content: () =>
            typeof compliance === 'number' && (
              <StyledFlexTopCenter as="span" sx={{ gap: 0.4 }}>
                {compliance}% {!!trending && <StyledSvg id={`trending-${trending}`} />}
              </StyledFlexTopCenter>
            ),
          value: Number(compliance),
        },
        actions: {
          content: () =>
            !!appletId && (
              <ActionsMenu
                menuItems={getActivityActions({ actions, appletId, activityId })}
                data-testid={`${dataTestid}-activity-actions`}
                buttonColor="secondary"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              />
            ),
          value: '',
        },
      };
    },
    [actions, appletId],
  );

  const activities = useMemo(
    () => (activitiesData?.result ?? []).map((activity) => formatRow(activity)),
    [activitiesData, formatRow],
  );

  useEffect(() => {
    if (!appletId) return;

    handleReload();

    return () => {
      setActivitiesData(null);
    };
  }, [appletId]);

  const isEmpty = !activities?.length && !isLoading;

  const getEmptyComponent = () => {
    if (isEmpty) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return appletId ? t('noActivitiesForApplet') : t('noActivities');
    }
  };

  return (
    <StyledBody>
      {isLoading && <Spinner />}

      <StyledFlexWrap sx={{ gap: 1.2, mb: 2.4 }}>
        {appletId && (
          <>
            <StyledFlexTopCenter sx={{ gap: 1.2 }}>
              <StyledButton
                variant="outlined"
                startIcon={<Svg width={18} height={18} id="slider-rows" />}
                // TODO: Implement filters
                // https://mindlogger.atlassian.net/browse/M2-5530
                onClick={() => alert('TODO: filters')}
                data-testid={`${dataTestid}-filters`}
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
                data-testid={`${dataTestid}-sort-by`}
              />
            </StyledFlexTopCenter>

            <StyledFlexWrap sx={{ gap: 1.2, ml: 'auto' }}>
              <StyledSearch
                withDebounce
                // TODO: Implement search
                // https://mindlogger.atlassian.net/browse/MLG-21
                placeholder={`TODO: ${t('searchActivities')}`}
                onSearch={handleSearch}
                data-testid={`${dataTestid}-search`}
              />

              <StyledButton
                variant="outlined"
                // TODO: Implement assign
                // https://mindlogger.atlassian.net/browse/M2-5710
                onClick={() => alert('TODO: Assign activity')}
                data-testid={`${dataTestid}-assign`}
                sx={{ minWidth: '10rem' }}
              >
                {t('assign')}
              </StyledButton>

              <StyledButton
                variant="contained"
                onClick={() => navigate(generatePath(page.builderAppletActivities, { appletId }))}
                data-testid={`${dataTestid}-add-activity`}
                sx={{ minWidth: '13.2rem' }}
              >
                {t('addActivity')}
              </StyledButton>
            </StyledFlexWrap>
          </>
        )}
      </StyledFlexWrap>

      {!!activities.length && (
        <StyledFlexWrap sx={{ gap: 2.4 }}>
          {activities.map((activity, index) => (
            <ActivitySummaryCard
              key={index}
              name={String(activity.name.value)}
              image={String(activity.image.value)}
              actionsMenu={activity.actions.content()}
              compliance={activity.compliance.content()}
              participantCount={activity.participantCount.content()}
              lastCompleted={activity.lastCompleted.content()}
              data-testid={`${dataTestid}-activity-card`}
            />
          ))}
        </StyledFlexWrap>
      )}

      {isEmpty && <EmptyState>{getEmptyComponent()}</EmptyState>}
    </StyledBody>
  );
};
