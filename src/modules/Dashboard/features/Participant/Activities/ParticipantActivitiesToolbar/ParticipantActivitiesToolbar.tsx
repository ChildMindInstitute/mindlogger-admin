import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ButtonWithMenu, Search, Svg } from 'shared/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { StyledFlexTopCenter, StyledFlexWrap } from 'shared/styles';
import { workspaces } from 'redux/modules';
import { checkIfCanManageParticipants } from 'shared/utils';

import { ParticipantActivitiesToolbarProps } from './ParticipantActivitiesToolbar.types';

export const ParticipantActivitiesToolbar = ({
  appletId,
  onClickAssign,
  sx,
  'data-testid': dataTestId,
  ...otherProps
}: ParticipantActivitiesToolbarProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const canAssignActivity =
    checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;

  return (
    <StyledFlexWrap sx={{ gap: 1.2, placeContent: 'space-between', ...sx }} {...otherProps}>
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

        {canAssignActivity && (
          <Button data-testid={`${dataTestId}-assign`} onClick={onClickAssign} variant="contained">
            {t('assignActivity')}
          </Button>
        )}
      </StyledFlexWrap>
    </StyledFlexWrap>
  );
};
