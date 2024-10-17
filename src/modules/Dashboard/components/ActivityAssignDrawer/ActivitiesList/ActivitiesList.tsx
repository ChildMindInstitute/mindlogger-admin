import { ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

import { Tooltip } from 'shared/components';
import { ActivityFlowThumbnail } from 'modules/Dashboard/components';
import { StyledActivityThumbnailContainer, StyledActivityThumbnailImg } from 'shared/styles';
import { FlowChip } from 'shared/components';

import {
  StyledList,
  StyledListItem,
  StyledListItemButton,
  StyledListItemTextPrimary,
  StyledReadOnlyButton,
} from './ActivitiesList.styles';
import { ActivitiesListProps } from './ActivitiesList.types';
import { ActivityCheckbox } from '../ActivityCheckbox';

export const ActivitiesList = ({
  activities,
  flows,
  activityIds,
  flowIds,
  onChangeActivityIds,
  onChangeFlowIds,
  isReadOnly,
  'data-testid': dataTestId,
}: ActivitiesListProps) => {
  const { t } = useTranslation('app');

  const handleActivityClick = (id: string) => {
    if (!activityIds || !onChangeActivityIds) return;

    if (activityIds?.includes(id)) {
      onChangeActivityIds(activityIds.filter((activityId) => activityId !== id));
    } else {
      onChangeActivityIds([...activityIds, id]);
    }
  };

  const handleFlowClick = (id: string) => {
    if (!flowIds || !onChangeFlowIds) return;

    if (flowIds?.includes(id)) {
      onChangeFlowIds(flowIds.filter((flowId) => flowId !== id));
    } else {
      onChangeFlowIds([...flowIds, id]);
    }
  };

  const ButtonComponent = isReadOnly ? StyledReadOnlyButton : StyledListItemButton;

  return (
    <StyledList data-testid={dataTestId} sx={isReadOnly ? { height: 'auto', py: 0.5 } : undefined}>
      {flows.map(({ id = '', activities, name, autoAssign, isHidden }) => {
        let tooltipTitle: ReactNode;
        if (isHidden) tooltipTitle = t('assignFlowDisabledTooltip');
        if (autoAssign) tooltipTitle = t('autoAssignFlowDisabled');
        const isDisabled = !!tooltipTitle;

        return (
          <Tooltip placement="left" tooltipTitle={tooltipTitle}>
            <StyledListItem
              key={id}
              secondaryAction={
                isReadOnly ? undefined : (
                  <ActivityCheckbox
                    checked={flowIds?.includes(id)}
                    onChange={() => handleFlowClick(id)}
                    data-testid={`${dataTestId}-flow-checkbox-${id}`}
                    disabled={isDisabled}
                  />
                )
              }
              data-testid={`${dataTestId}-flow-item`}
            >
              <ButtonComponent
                onClick={isReadOnly ? undefined : () => handleFlowClick(id)}
                disabled={isDisabled}
              >
                <ListItemIcon>
                  <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                    <ActivityFlowThumbnail activities={activities} />
                  </StyledActivityThumbnailContainer>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <StyledListItemTextPrimary>
                      {name}
                      <FlowChip />
                    </StyledListItemTextPrimary>
                  }
                />
              </ButtonComponent>
            </StyledListItem>
          </Tooltip>
        );
      })}

      {activities.map(({ id = '', name, image, autoAssign, isHidden }) => {
        let tooltipTitle: ReactNode;
        if (isHidden) tooltipTitle = t('assignActivityDisabledTooltip');
        if (autoAssign) tooltipTitle = t('autoAssignActivityDisabled');
        const isDisabled = !!tooltipTitle;

        return (
          <Tooltip placement="left" tooltipTitle={tooltipTitle}>
            <StyledListItem
              key={id}
              secondaryAction={
                isReadOnly ? undefined : (
                  <ActivityCheckbox
                    checked={activityIds?.includes(id)}
                    onChange={() => handleActivityClick(id)}
                    data-testid={`${dataTestId}-activity-checkbox-${id}`}
                    disabled={isDisabled}
                  />
                )
              }
              data-testid={`${dataTestId}-activity-item`}
            >
              <ButtonComponent
                onClick={isReadOnly ? undefined : () => handleActivityClick(id)}
                disabled={isDisabled}
              >
                <ListItemIcon>
                  <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                    {!!image && <StyledActivityThumbnailImg src={image} alt={name} />}
                  </StyledActivityThumbnailContainer>
                </ListItemIcon>
                <ListItemText
                  primary={<StyledListItemTextPrimary>{name}</StyledListItemTextPrimary>}
                />
              </ButtonComponent>
            </StyledListItem>
          </Tooltip>
        );
      })}
    </StyledList>
  );
};
