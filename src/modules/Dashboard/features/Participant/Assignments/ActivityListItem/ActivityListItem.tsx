import { useState } from 'react';
import { CircularProgress, Collapse, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TransitionGroup } from 'react-transition-group';

import {
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledFlexTopCenter,
  variables,
} from 'shared/styles';
import { ActivityFlowThumbnail, ActivityStatusChip } from 'modules/Dashboard/components';
import { FlowChip, Svg } from 'shared/components';

import { ActivityListItemProps } from './ActivityListItem.types';
import {
  StyledActivityListItem,
  StyledActivityListItemInner,
  StyledActivityName,
} from './ActivityListItem.styles';

/**
 * Generic container for displaying an activity or flow in any of the lists shown on the
 * Participant Details page.
 *
 * If it's desirable for a button being passed in the `children` to cause the entire list item to be
 * clickable, make sure to assign it the CSS class `primary-button`. It's advised to add the
 * `disableRipple` prop to such a button for a better user experience.
 */
export const ActivityListItem = ({
  activityOrFlow,
  onClickToggleExpandedView,
  expandedView,
  isLoadingExpandedView,
  children,
  dataTestId,
}: ActivityListItemProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });
  const { isFlow, images, name, status } = activityOrFlow;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandComplete, setIsExpandComplete] = useState(false);

  const handleClickToggleExpandedView = () => {
    setIsExpanded(!isExpanded);
    onClickToggleExpandedView?.(!isExpanded);
  };

  return (
    <StyledActivityListItem data-testid={`${dataTestId}-activity-list-item`}>
      <StyledActivityListItemInner>
        <StyledFlexTopCenter sx={{ gap: 0.8 }}>
          <StyledActivityThumbnailContainer sx={{ width: '5.6rem', height: '5.6rem', mr: 0.8 }}>
            {isFlow ? (
              <ActivityFlowThumbnail activities={images} />
            ) : (
              images[0] && <StyledActivityThumbnailImg src={images[0]} alt={name} />
            )}
          </StyledActivityThumbnailContainer>
          <StyledActivityName>{name}</StyledActivityName>
          {isFlow && <FlowChip size="small" />}
          <ActivityStatusChip status={status} />
        </StyledFlexTopCenter>

        <StyledFlexTopCenter sx={{ gap: 0.8, ml: 'auto' }}>
          {children}

          {expandedView && (
            <IconButton
              onClick={handleClickToggleExpandedView}
              color="outlined"
              sx={{ ml: 0.8 }}
              className="primary-button"
              disableRipple
              disabled={isLoadingExpandedView}
            >
              {isLoadingExpandedView && !isExpandComplete ? (
                <CircularProgress size={24} />
              ) : (
                <Svg
                  aria-label={t('toggleSubjectsView')}
                  id={isExpanded ? 'navigate-up' : 'navigate-down'}
                  fill={variables.palette.on_surface_variant}
                />
              )}
            </IconButton>
          )}
        </StyledFlexTopCenter>
      </StyledActivityListItemInner>

      {expandedView && (
        <TransitionGroup>
          {isExpanded && (!isLoadingExpandedView || isExpandComplete) ? (
            <Collapse
              onEntered={() => setIsExpandComplete(true)}
              onExit={() => setIsExpandComplete(false)}
            >
              {expandedView}
            </Collapse>
          ) : undefined}
        </TransitionGroup>
      )}
    </StyledActivityListItem>
  );
};
