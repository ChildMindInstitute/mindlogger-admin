import { useTranslation } from 'react-i18next';
import { ListItemIcon, ListItemText } from '@mui/material';
import { useController, useWatch } from 'react-hook-form';

import { Chip, ChipShape, Svg } from 'shared/components';
import { ActivityFlowThumbnail } from 'modules/Dashboard/components';
import { StyledActivityThumbnailContainer, StyledActivityThumbnailImg } from 'shared/styles';

import {
  StyledList,
  StyledListItem,
  StyledListItemButton,
  StyledListItemTextPrimary,
} from './ActivitiesList.styles';
import { ActivitiesListProps } from './ActivitiesList.types';
import { ActivityCheckbox } from '../ActivityCheckbox';

export const ActivitiesList = ({
  activities,
  flows,
  control,
  'data-testid': dataTestId,
}: ActivitiesListProps) => {
  const { t } = useTranslation('app');
  const [activityIds, flowIds] = useWatch({ control, name: ['activityIds', 'flowIds'] });
  const {
    field: { onChange: onChangeActivityIds },
  } = useController({ control, name: 'activityIds' });
  const {
    field: { onChange: onChangeFlowIds },
  } = useController({ control, name: 'flowIds' });

  const handleActivityClick = (id: string) => {
    if (activityIds.includes(id)) {
      onChangeActivityIds(activityIds.filter((activityId) => activityId !== id));
    } else {
      onChangeActivityIds([...activityIds, id]);
    }
  };

  const handleFlowClick = (id: string) => {
    if (flowIds.includes(id)) {
      onChangeFlowIds(flowIds.filter((flowId) => flowId !== id));
    } else {
      onChangeFlowIds([...flowIds, id]);
    }
  };

  return (
    <StyledList data-testid={dataTestId}>
      {flows.map(({ id = '', activities, name }) => (
        <StyledListItem
          key={id}
          secondaryAction={<ActivityCheckbox isChecked={flowIds.includes(id)} />}
        >
          <StyledListItemButton onClick={() => handleFlowClick(id)}>
            <ListItemIcon>
              <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                <ActivityFlowThumbnail activities={activities} />
              </StyledActivityThumbnailContainer>
            </ListItemIcon>
            <ListItemText
              primary={
                <StyledListItemTextPrimary>
                  {name}
                  <Chip
                    color="secondary"
                    size="medium"
                    icon={<Svg aria-hidden id="multiple-activities" height={18} width={18} />}
                    shape={ChipShape.Rectangular}
                    title={t('flow')}
                  />
                </StyledListItemTextPrimary>
              }
            />
          </StyledListItemButton>
        </StyledListItem>
      ))}

      {activities.map(({ id = '', name, image }) => (
        <StyledListItem
          key={id}
          secondaryAction={<ActivityCheckbox isChecked={activityIds.includes(id)} />}
        >
          <StyledListItemButton onClick={() => handleActivityClick(id)}>
            <ListItemIcon>
              <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                {!!image && <StyledActivityThumbnailImg src={image} alt={name} />}
              </StyledActivityThumbnailContainer>
            </ListItemIcon>
            <ListItemText primary={<StyledListItemTextPrimary>{name}</StyledListItemTextPrimary>} />
          </StyledListItemButton>
        </StyledListItem>
      ))}
    </StyledList>
  );
};
