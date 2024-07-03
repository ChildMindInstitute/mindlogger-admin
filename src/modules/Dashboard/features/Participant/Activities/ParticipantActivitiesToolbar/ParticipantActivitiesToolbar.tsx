import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ButtonWithMenu, Search, Svg } from 'shared/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { StyledFlexTopCenter, StyledFlexWrap, theme } from 'shared/styles';

import { ParticipantActivitiesToolbarProps } from './ParticipantActivitiesToolbar.types';

export const ParticipantActivitiesToolbar = ({
  appletId,
  'data-testid': dataTestId,
  sx,
  ...otherProps
}: ParticipantActivitiesToolbarProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <StyledFlexWrap sx={{ gap: 1.2, placeContent: 'space-between', ...sx }} {...otherProps}>
      {appletId && (
        <>
          {featureFlags.enableActivityFilterSort && (
            <StyledFlexTopCenter sx={{ gap: 1.2 }}>
              <Button
                data-testid={`${dataTestId}-filters`}
                onClick={() => {
                  // TODO: Implement filters
                  // https://mindlogger.atlassian.net/browse/M2-5530
                  alert('TODO: filters');
                }}
                startIcon={<Svg width={18} height={18} id="slider-rows" />}
                variant="outlined"
              >
                {t('filters')}
              </Button>

              <ButtonWithMenu
                anchorEl={anchorEl}
                data-testid={`${dataTestId}-sort-by`}
                label={t('sortBy')}
                // TODO: Implement sorting
                // https://mindlogger.atlassian.net/browse/M2-5445
                menuItems={[
                  {
                    title: 'TODO: Sort options',
                    action: () => {},
                  },
                ]}
                setAnchorEl={setAnchorEl}
                startIcon={<></>}
                variant="outlined"
              />
            </StyledFlexTopCenter>
          )}

          <StyledFlexWrap sx={{ gap: 1.2 }}>
            <Search
              data-testid={`${dataTestId}-search`}
              placeholder={t('searchActivities')}
              sx={{ width: '32rem' }}
              withDebounce
            />

            {featureFlags.enableActivityAssign && (
              <Button
                data-testid={`${dataTestId}-assign`}
                onClick={() => {
                  // TODO: Implement assign
                  // https://mindlogger.atlassian.net/browse/M2-5710
                  alert('TODO: Assign activity');
                }}
                sx={{ minWidth: theme.spacing(10) }}
                variant="contained"
              >
                {t('assignActivity')}
              </Button>
            )}
          </StyledFlexWrap>
        </>
      )}
    </StyledFlexWrap>
  );
};
