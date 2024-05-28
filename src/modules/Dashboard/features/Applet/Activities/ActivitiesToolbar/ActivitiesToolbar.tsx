import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';

import { page } from 'resources';
import { ButtonWithMenu, Svg } from 'shared/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { StyledFlexTopCenter, StyledFlexWrap, theme } from 'shared/styles';
import { checkIfCanEdit } from 'shared/utils';
import { workspaces } from 'shared/state';

import { ActivitiesToolbarProps } from './ActivitiesToolbar.types';

export const ActivitiesToolbar = ({
  appletId,
  'data-testid': dataTestId,
  sx,
  ...otherProps
}: ActivitiesToolbarProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  const canEditApplet = checkIfCanEdit(roles);

  return (
    <StyledFlexWrap sx={{ gap: 1.2, ...sx }} {...otherProps}>
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
                    action: () => alert('TODO: Sort options'),
                  },
                ]}
                setAnchorEl={setAnchorEl}
                startIcon={<></>}
                variant="outlined"
              />
            </StyledFlexTopCenter>
          )}

          <StyledFlexWrap sx={{ ml: 'auto', gap: 1.2 }}>
            {featureFlags.enableActivityAssign && (
              <Button
                data-testid={`${dataTestId}-assign`}
                onClick={() => {
                  // TODO: Implement assign
                  // https://mindlogger.atlassian.net/browse/M2-5710
                  alert('TODO: Assign activity');
                }}
                sx={{ minWidth: theme.spacing(10) }}
                variant="tonal"
              >
                {t('assign')}
              </Button>
            )}

            {canEditApplet && (
              <Button
                component={Link}
                to={generatePath(page.builderAppletActivities, { appletId })}
                variant="contained"
                data-testid={`${dataTestId}-add-activity`}
                sx={{ minWidth: theme.spacing(13.2) }}
              >
                {t('addActivity')}
              </Button>
            )}
          </StyledFlexWrap>
        </>
      )}
    </StyledFlexWrap>
  );
};
