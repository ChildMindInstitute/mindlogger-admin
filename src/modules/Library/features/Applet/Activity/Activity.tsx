import { Fragment, SyntheticEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Checkbox } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexTopCenter, StyledSvgArrowContainer } from 'shared/styles';

import { ActivityProps } from './Activity.types';
import {
  StyledActivityContainer,
  StyledActivityHeader,
  StyledActivityName,
  StyledItemsList,
} from './Activity.styles';
import { Item } from '../Item';
import { LibraryForm, SelectedItem } from '../Applet.types';
import { checkIfPerformanceTask } from './Activity.utils';

export const Activity = ({ appletId, activity: { name, items } }: ActivityProps) => {
  const { watch, setValue, getValues } = useFormContext<LibraryForm>();
  const watchApplet = watch(appletId);
  const [activityVisible, setActivityVisible] = useState(false);
  const [activityIndeterminate, setActivityIndeterminate] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);

  const handleActivityChecked = (event: SyntheticEvent<Element, Event>, checked: boolean) => {
    setActivityChecked(checked);
    const selectedItems = getValues()[appletId];

    if (!checked) {
      return setValue(
        appletId,
        selectedItems.filter((selectedItem) => selectedItem.activityName !== name),
      );
    }

    const unselectedItems = items.reduce(
      (unselected: SelectedItem[], item) =>
        selectedItems.find((selectedItem) => item.name === selectedItem.name)
          ? unselected
          : [...unselected, { name: item.name, activityName: name }],
      [],
    );

    setValue(appletId, [...selectedItems, ...unselectedItems]);
  };

  const isPerfTask = checkIfPerformanceTask(items);
  const arrowSgvId = activityVisible ? 'navigate-up' : 'navigate-down';

  useEffect(() => {
    const currentActivityItems = watchApplet.filter((item) => item.activityName === name);
    const isAllItemsSelected = currentActivityItems.length === items.length;
    const isIndeterminate = currentActivityItems.length > 0 && !isAllItemsSelected;
    setActivityIndeterminate(isIndeterminate);
    setActivityChecked(isAllItemsSelected);
  }, [watchApplet]);

  return (
    <StyledActivityContainer>
      <Checkbox
        sx={{ width: '4rem', height: '4rem' }}
        checked={activityChecked}
        indeterminate={activityIndeterminate}
        onChange={handleActivityChecked}
      />
      {isPerfTask ? (
        <StyledFlexTopCenter>
          <Box sx={{ width: '4rem', height: '4rem' }} />
          <StyledActivityName>{name}</StyledActivityName>
        </StyledFlexTopCenter>
      ) : (
        <StyledActivityHeader onClick={() => setActivityVisible((prevState) => !prevState)}>
          <StyledSvgArrowContainer>
            <Svg id={arrowSgvId} />
          </StyledSvgArrowContainer>
          <StyledActivityName>{name}</StyledActivityName>
        </StyledActivityHeader>
      )}
      {activityVisible && !!items?.length && (
        <StyledItemsList>
          {items?.map((item) => (
            <Fragment key={item.name}>
              <Item appletId={appletId} activityName={name} item={item} />
            </Fragment>
          ))}
        </StyledItemsList>
      )}
    </StyledActivityContainer>
  );
};
