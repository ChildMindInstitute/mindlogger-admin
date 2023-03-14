import { Fragment, SyntheticEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledTitleBoldMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { ActivityProps } from './Activity.types';
import {
  StyledActivityContainer,
  StyledActivityHeader,
  StyledNavigateSvg,
  StyledItemsList,
} from './Activity.styles';
import { Item } from '../Item';

export const Activity = ({
  appletId,
  setAddToBuilderDisabled,
  activity: { id, name, items },
}: ActivityProps) => {
  const { watch, setValue } = useFormContext();
  const watchItems = watch(items.map((item) => `${appletId}.${id}.${item.id}`));
  const [activityVisible, setActivityVisible] = useState(false);
  const [activityIndeterminate, setActivityIndeterminate] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);

  const handleActivityChecked = (event: SyntheticEvent<Element, Event>, checked: boolean) => {
    setActivityChecked(checked);
    setValue(
      `${appletId}.${id}`,
      items.reduce((activityItems, item) => ({ ...activityItems, [item.id]: checked }), []),
    );
  };

  console.log('rerender');

  useEffect(() => {
    const watchItemsSet = new Set(watchItems);
    const indeterminate = watchItemsSet.size !== 1;

    setActivityIndeterminate(indeterminate);
    setActivityChecked(!indeterminate && watchItems[0]);
    setAddToBuilderDisabled(!indeterminate && !watchItems[0]);
  }, [watchItems]);

  return (
    <StyledActivityContainer>
      <Checkbox
        checked={activityChecked}
        indeterminate={activityIndeterminate}
        onChange={handleActivityChecked}
      />
      <StyledActivityHeader onClick={() => setActivityVisible((prevState) => !prevState)}>
        <StyledNavigateSvg>
          <Svg id={activityVisible ? 'navigate-up' : 'navigate-down'} />
        </StyledNavigateSvg>
        <StyledTitleBoldMedium sx={{ padding: theme.spacing(0.7, 0) }}>
          {name}
        </StyledTitleBoldMedium>
      </StyledActivityHeader>
      {activityVisible && !!items?.length && (
        <StyledItemsList>
          {items?.map((item) => (
            <Fragment key={item.id}>
              <Item appletId={appletId} activityId={id} item={item} />
            </Fragment>
          ))}
        </StyledItemsList>
      )}
    </StyledActivityContainer>
  );
};
