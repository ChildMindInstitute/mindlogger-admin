import { useState } from 'react';
import { Accordion, AccordionDetails, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledFlexTopCenter,
  variables,
} from 'shared/styles';
import { ActivityFlowThumbnail, ActivityStatusChip } from 'modules/Dashboard/components';
import { FlowChip, Svg } from 'shared/components';

import { ActivityListItemProps } from './ActivityListItem.types';
import { StyledActivityListItem, StyledActivityName } from './ActivityListItem.styles';

export const ActivityListItem = ({
  activityOrFlow,
  onClick,
  expandedView,
  onClickToggleExpandedView,
  children,
}: ActivityListItemProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });
  const { isFlow, images, name, status } = activityOrFlow;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClickToggleExpandedView = () => {
    setIsExpanded(!isExpanded);
    onClickToggleExpandedView?.(!isExpanded);
  };

  return (
    <StyledActivityListItem as={onClick ? 'a' : 'div'} onClick={onClick}>
      <StyledFlexTopCenter sx={{ flexWrap: 'wrap', p: 1.5, columnGap: 4.8, rowGap: 0.8 }}>
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

        <StyledFlexTopCenter sx={{ gap: 0.8, ml: 'auto' }}>{children}</StyledFlexTopCenter>

        {expandedView && (
          <IconButton onClick={handleClickToggleExpandedView} color="outlined">
            <Svg
              aria-label={t('reviewToggleButton')}
              id={isExpanded ? 'navigate-up' : 'navigate-down'}
              fill={variables.palette.on_surface_variant}
            />
          </IconButton>
        )}
      </StyledFlexTopCenter>

      {expandedView && (
        <Accordion expanded={isExpanded}>
          <AccordionDetails>{expandedView}</AccordionDetails>
        </Accordion>
      )}
    </StyledActivityListItem>
  );
};
