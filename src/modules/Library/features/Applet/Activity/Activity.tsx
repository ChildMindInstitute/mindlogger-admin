import { Fragment, SyntheticEvent, useEffect, useState, useReducer } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Checkbox } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexTopCenter, StyledSvgArrowContainer } from 'shared/styles';
import { getSelectedAppletFromStorage, updateSelectedItemsInStorage } from 'modules/Library/utils';
import { useAppDispatch } from 'redux/store';
import { library } from 'redux/modules';
import { getHighlightedText } from 'shared/utils';

import { ActivityProps } from './Activity.types';
import {
  StyledActivityContainer,
  StyledActivityHeader,
  StyledActivityName,
  StyledItemsList,
} from './Activity.styles';
import { Item } from '../Item';
import { AppletUiType, LibraryForm, SelectedItem } from '../Applet.types';
import { checkIfPerformanceTask } from './Activity.utils';

export const Activity = ({
  appletId,
  activity: { name, items, key },
  uiType,
  search,
}: ActivityProps) => {
  const { watch, setValue, getValues } = useFormContext<LibraryForm>();
  const dispatch = useAppDispatch();
  const watchApplet = watch(appletId);
  const [activityVisible, setActivityVisible] = useState(false);
  const [activityIndeterminate, setActivityIndeterminate] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);
  const forceUpdate = useReducer((x) => x + 1, 0)[1];

  const updateSelectedItems = () => {
    if (uiType === AppletUiType.Cart) {
      const { isNoSelectedItems } = updateSelectedItemsInStorage(getValues(), appletId);
      dispatch(library.actions.setAddToCartBtnDisabled(isNoSelectedItems));
    }
  };

  const handleActivityChecked = async (event: SyntheticEvent<Element, Event>, checked: boolean) => {
    setActivityChecked(checked);
    const selectedItems = getValues()[appletId];
    const activityNamePlusId = `${name}-${appletId}`;

    if (!checked) {
      await setValue(
        appletId,
        selectedItems.filter(
          (selectedItem) => selectedItem.activityNamePlusId !== activityNamePlusId,
        ),
      );
      updateSelectedItems();

      return;
    }

    const unselectedItems = items.reduce((unselected: SelectedItem[], item) => {
      const itemNamePlusActivityName = `${item.name}-${name}`;

      return selectedItems.find(
        (selectedItem) => selectedItem.itemNamePlusActivityName === itemNamePlusActivityName,
      )
        ? unselected
        : [
            ...unselected,
            { itemNamePlusActivityName, activityName: name, activityNamePlusId, activityKey: key },
          ];
    }, []);

    await setValue(appletId, [...selectedItems, ...unselectedItems]);

    updateSelectedItems();
  };

  const isPerfTask = checkIfPerformanceTask(items);
  const arrowSgvId = activityVisible ? 'navigate-up' : 'navigate-down';

  const getCheckedActivity = (currentItems: SelectedItem[]) => {
    const currentActivityItems = currentItems?.filter((item) => item.activityName === name);
    const isAllItemsSelected = currentActivityItems?.length === items.length;
    const isIndeterminate = currentActivityItems?.length > 0 && !isAllItemsSelected;
    setActivityIndeterminate(isIndeterminate);
    setActivityChecked(isAllItemsSelected);
  };

  useEffect(() => {
    const selectedAppletItems = getSelectedAppletFromStorage(appletId);
    if (!selectedAppletItems) return;
    setValue(appletId, selectedAppletItems);
    uiType === AppletUiType.Details && forceUpdate();
  }, [appletId]);

  useEffect(() => {
    getCheckedActivity(watchApplet);
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
          <StyledActivityName>{getHighlightedText(name, search)}</StyledActivityName>
        </StyledFlexTopCenter>
      ) : (
        <StyledActivityHeader onClick={() => setActivityVisible((prevState) => !prevState)}>
          <StyledSvgArrowContainer>
            <Svg id={arrowSgvId} />
          </StyledSvgArrowContainer>
          <StyledActivityName>{getHighlightedText(name, search)}</StyledActivityName>
        </StyledActivityHeader>
      )}
      {activityVisible && !!items?.length && (
        <StyledItemsList>
          {items?.map((item) => (
            <Fragment key={item.name}>
              <Item
                appletId={appletId}
                activityName={name}
                item={item}
                activityKey={key}
                uiType={uiType}
                search={search}
              />
            </Fragment>
          ))}
        </StyledItemsList>
      )}
    </StyledActivityContainer>
  );
};
