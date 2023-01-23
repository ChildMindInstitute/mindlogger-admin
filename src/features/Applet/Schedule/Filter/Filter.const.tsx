import { Fragment } from 'react';

import { Svg } from 'components';

import { Counter } from './Counter';
import { StyledCreateBtn, StyledDeactivated, StyledIndicator } from './Filter.styles';
import { getScheduledIndicatorColor, getScheduledTitle } from './Filter.utils';

export const schedules = {
  DailyJournal: 'Daily Journal',
  PreQuestionnaire: 'Pre-questionnaire',
  MorningAssessment: 'Morning Assessment',
  MiddayAssessment: 'MiddayAssessment',
  EveningAssessment: 'Evening Assessment',
} as const;

export const options = [
  { labelKey: 'Default Schedule', value: 'Default Schedule' },
  { labelKey: 'Individual Schedule', value: 'Individual Schedule' },
];

export const availableItems = [<>Emotional Support</>, <>Incentive Activity</>];

export const deactivatedItems = [<StyledDeactivated>Draft 6</StyledDeactivated>];

export const scheduledItems = [
  <>
    <Svg id="add" />
    <StyledCreateBtn>Create Event</StyledCreateBtn>
  </>,
  ...Object.values(schedules).map((el) => (
    <Fragment key={el}>
      <StyledIndicator colors={getScheduledIndicatorColor(el)} />
      {getScheduledTitle(el)}
      <Counter count={1} />
    </Fragment>
  )),
];

export const getExpandedLists = () => {
  const commonProps = { width: 18, height: 18 };

  return [
    {
      buttons: [
        { icon: <Svg id="clear-calendar" {...commonProps} />, action: () => null },
        { icon: <Svg id="visibility-on" {...commonProps} />, action: () => null },
      ],
      items: scheduledItems,
      title: 'Scheduled',
    },
    {
      buttons: [{ icon: <Svg id="visibility-off" {...commonProps} />, action: () => null }],
      items: availableItems,
      title: 'Always Available',
    },
    {
      buttons: [{ icon: <Svg id="settings" {...commonProps} />, action: () => null }],
      items: deactivatedItems,
      title: 'Deactivated',
    },
  ];
};
