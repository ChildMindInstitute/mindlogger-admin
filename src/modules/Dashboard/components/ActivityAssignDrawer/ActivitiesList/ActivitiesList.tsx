import { ListItemIcon, ListItemText } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { ActivityFlowThumbnail } from 'modules/Dashboard/components';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { Activity } from 'redux/modules';
import { FlowChip, Tooltip } from 'shared/components';
import { StyledActivityThumbnailContainer, StyledActivityThumbnailImg } from 'shared/styles';

import { ActivityCheckbox } from '../ActivityCheckbox';
import {
  StyledList,
  StyledListItem,
  StyledListItemButton,
  StyledListItemTextPrimary,
  StyledReadOnlyButton,
} from './ActivitiesList.styles';
import { ActivitiesListProps } from './ActivitiesList.types';

const VIRTUALIZATION_THRESHOLD = 30;
const ROW_HEIGHT = 72;

// Define proper types for combined items
type FlowItem = HydratedActivityFlow & { itemType: 'flow' };
type ActivityItem = Activity & { itemType: 'activity' };
type CombinedItem = FlowItem | ActivityItem;

// Type guard functions to check item type
const isFlowItem = (item: CombinedItem): item is FlowItem => item.itemType === 'flow';

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

  const allItems = useMemo(() => {
    const flowItems = flows.map((item) => ({ ...item, itemType: 'flow' as const }));
    const activityItems = activities.map((item) => ({ ...item, itemType: 'activity' as const }));

    return [...flowItems, ...activityItems] as CombinedItem[];
  }, [flows, activities]);

  const shouldVirtualize = allItems.length > VIRTUALIZATION_THRESHOLD;

  // Render function for each row in the virtualized list
  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const item = allItems[index];
    const isFlow = isFlowItem(item);
    const id = item.id || '';

    let tooltipTitle: ReactNode;
    if (item.isHidden)
      tooltipTitle = t(isFlow ? 'assignFlowDisabledTooltip' : 'assignActivityDisabledTooltip');
    if (item.autoAssign)
      tooltipTitle = t(isFlow ? 'autoAssignFlowDisabled' : 'autoAssignActivityDisabled');
    const isDisabled = !!tooltipTitle;

    return (
      <div style={style}>
        <Tooltip placement="left" tooltipTitle={tooltipTitle}>
          <StyledListItem
            key={id}
            secondaryAction={
              isReadOnly ? undefined : (
                <ActivityCheckbox
                  checked={isFlow ? flowIds?.includes(id) : activityIds?.includes(id)}
                  onChange={() => (isFlow ? handleFlowClick(id) : handleActivityClick(id))}
                  data-testid={`${dataTestId}-${isFlow ? 'flow' : 'activity'}-checkbox-${id}`}
                  disabled={isDisabled}
                />
              )
            }
            data-testid={`${dataTestId}-${isFlow ? 'flow' : 'activity'}-item`}
          >
            <ButtonComponent
              onClick={
                isReadOnly
                  ? undefined
                  : () => (isFlow ? handleFlowClick(id) : handleActivityClick(id))
              }
              disabled={isDisabled}
            >
              <ListItemIcon>
                <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                  {isFlow ? (
                    <ActivityFlowThumbnail activities={item.activities} />
                  ) : (
                    item.image && <StyledActivityThumbnailImg src={item.image} alt={item.name} />
                  )}
                </StyledActivityThumbnailContainer>
              </ListItemIcon>
              <ListItemText
                primary={
                  <StyledListItemTextPrimary>
                    {item.name}
                    {isFlow && <FlowChip />}
                  </StyledListItemTextPrimary>
                }
              />
            </ButtonComponent>
          </StyledListItem>
        </Tooltip>
      </div>
    );
  };

  if (shouldVirtualize) {
    return (
      <FixedSizeList
        height={Math.min(400, allItems.length * ROW_HEIGHT)}
        width="100%"
        itemSize={ROW_HEIGHT}
        itemCount={allItems.length}
        overscanCount={5}
        data-testid={dataTestId}
      >
        {renderRow}
      </FixedSizeList>
    );
  }

  return (
    <StyledList data-testid={dataTestId} sx={isReadOnly ? { height: 'auto', py: 0.5 } : undefined}>
      {flows.map(({ id = '', activities, name, autoAssign, isHidden }) => {
        let tooltipTitle: ReactNode;
        if (isHidden) tooltipTitle = t('assignFlowDisabledTooltip');
        if (autoAssign) tooltipTitle = t('autoAssignFlowDisabled');
        const isDisabled = !!tooltipTitle;

        return (
          <Tooltip placement="left" tooltipTitle={tooltipTitle} key={id}>
            <StyledListItem
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
          <Tooltip placement="left" tooltipTitle={tooltipTitle} key={id}>
            <StyledListItem
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
