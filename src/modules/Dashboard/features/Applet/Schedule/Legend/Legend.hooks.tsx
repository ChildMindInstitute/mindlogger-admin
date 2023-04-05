import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Svg } from 'shared/components';
import { page } from 'resources';
import { BUILDER_PAGES } from 'shared/consts';
import { calendarEvents } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();

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

  const noScheduledEvents = scheduledEvents.length === 0;
  const noAvailableEvents = alwaysAvailableEvents.length === 0;
  const noDeactivatedEvents = deactivatedEvents.length === 0;

  const handleAvailableVisibilityChange = () => {
    setAvailableVisibility((isVisible) => {
      dispatch(calendarEvents.actions.setCalendarEvents({ alwaysAvailableHidden: isVisible }));

      return !isVisible;
    });
  };

  const handleScheduledVisibilityChange = () => {
    setScheduledVisibility((isVisible) => {
      dispatch(calendarEvents.actions.setCalendarEvents({ scheduledHidden: isVisible }));

      return !isVisible;
    });
  };

  return [
    {
      buttons: [
        {
          icon: <Svg id="clear-calendar" {...commonProps} />,
          action: clearAllScheduledEventsAction,
          tooltipTitle: t('clearAllScheduledEvents'),
          disabled: noScheduledEvents,
        },
        {
          icon: (
            <Svg id={scheduledVisibility ? 'visibility-on' : 'visibility-off'} {...commonProps} />
          ),
          action: handleScheduledVisibilityChange,
          tooltipTitle: t('hideFromCalendar'),
          disabled: noScheduledEvents,
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
          action: handleAvailableVisibilityChange,
          tooltipTitle: t('hideFromCalendar'),
          disabled: noAvailableEvents,
        },
      ],
      items: availableItems,
      title: t('alwaysAvailable'),
      isHiddenInLegend: noScheduledEvents && noAvailableEvents,
      allAvailableScheduled: noAvailableEvents && !noScheduledEvents,
    },
    {
      buttons: [
        {
          icon: <Svg id="external-link" {...commonProps} />,
          action: () => navigate(`${page.builder}/${id}/${BUILDER_PAGES.activities}`),
          tooltipTitle: t('activateInBuilder'),
        },
      ],
      items: deactivatedItems,
      title: t('deactivated'),
      isHiddenInLegend: noDeactivatedEvents,
    },
  ];
};
