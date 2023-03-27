import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';

import { PreparedEvents } from '../Schedule.types';
import { Counter } from './Counter';
import { StyledCreateBtn, StyledDeactivated, StyledIndicator } from './Legend.styles';
import { getTitle } from './Legend.utils';

export const useExpandedLists = (
  legendEvents: PreparedEvents | null,
  clearAllScheduledEventsAction: () => void,
  onCreateActivitySchedule: () => void,
) => {
  const [scheduledVisibility, setScheduledVisibility] = useState(true);
  const [availableVisibility, setAvailableVisibility] = useState(true);
  const { t } = useTranslation('app');
  if (!legendEvents) return;

  const commonProps = { width: 18, height: 18 };
  const { alwaysAvailableEvents = [], scheduledEvents = [], deactivatedEvents = [] } = legendEvents;

  const availableItems = alwaysAvailableEvents.map(({ name, id, isFlow, colors }) => (
    <Fragment key={id}>
      {availableVisibility && colors && <StyledIndicator colors={colors} />}
      {getTitle(name, isFlow)}
    </Fragment>
  ));

  const deactivatedItems = deactivatedEvents.map(({ name, id, isFlow }) => (
    <StyledDeactivated key={id}>{getTitle(name, isFlow)}</StyledDeactivated>
  ));

  const scheduledItems = [
    <StyledCreateBtn onClick={onCreateActivitySchedule}>
      <Svg id="add" width={20} height={20} />
      {t('createEvent')}
    </StyledCreateBtn>,
    ...scheduledEvents.map(({ name, id, isFlow, count, colors }) => (
      <Fragment key={id}>
        {scheduledVisibility && colors && <StyledIndicator colors={colors} />}
        {getTitle(name, isFlow)}
        {count && <Counter count={count} />}
      </Fragment>
    )),
  ];

  return [
    {
      buttons: [
        {
          icon: <Svg id="clear-calendar" {...commonProps} />,
          action: clearAllScheduledEventsAction,
          tooltipTitle: t('clearAllScheduledEvents'),
          disabled: scheduledEvents.length === 0,
        },
        {
          icon: (
            <Svg id={scheduledVisibility ? 'visibility-on' : 'visibility-off'} {...commonProps} />
          ),
          action: () => setScheduledVisibility((prev) => !prev),
          tooltipTitle: t('hideFromCalendar'),
          disabled: scheduledEvents.length === 0,
        },
      ],
      items: scheduledItems,
      title: t('scheduled'),
    },
    {
      buttons: [
        {
          icon: (
            <Svg id={availableVisibility ? 'visibility-on' : 'visibility-off'} {...commonProps} />
          ),
          action: () => setAvailableVisibility((prev) => !prev),
          tooltipTitle: t('hideFromCalendar'),
          disabled: alwaysAvailableEvents.length === 0,
        },
      ],
      items: availableItems,
      title: t('alwaysAvailable'),
      isHiddenInLegend: scheduledEvents.length === 0 && alwaysAvailableEvents.length === 0,
      availableEventsScheduled: alwaysAvailableEvents.length === 0 && scheduledEvents.length > 0,
    },
    {
      buttons: [
        {
          icon: <Svg id="external-link" {...commonProps} />,
          action: () => null,
          tooltipTitle: t('activateInBuilder'),
        },
      ],
      items: deactivatedItems,
      title: t('deactivated'),
    },
  ];
};
