import { Fragment } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { calendarEvents } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { Svg } from 'shared/components/Svg';
import { BUILDER_PAGES } from 'shared/consts';

import { PreparedEvents } from '../Schedule.types';
import { Counter } from './Counter';
import { ExpandedListTypes } from './Legend.const';
import { StyledCreateBtn, StyledDeactivated, StyledIndicator } from './Legend.styles';
import { getTitle } from './Legend.utils';

export const useExpandedLists = (
  legendEvents: PreparedEvents | null,
  clearAllScheduledEventsAction: () => void,
  onCreateActivitySchedule: () => void,
) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId: id } = useParams();
  const dispatch = useAppDispatch();
  const scheduledVisibility = calendarEvents.useScheduledVisibilityData();
  const availableVisibility = calendarEvents.useAvailableVisibilityData();
  const { setAvailableVisibility, setScheduledVisibility, createCalendarEvents } = calendarEvents.actions;

  if (!legendEvents) return;

  const commonProps = { width: 18, height: 18 };
  const { alwaysAvailableEvents = [], scheduledEvents = [], deactivatedEvents = [] } = legendEvents;

  const availableItems = alwaysAvailableEvents.map(({ name, id, isFlow, colors }) => (
    <Fragment key={id}>
      {availableVisibility && colors?.[0] && <StyledIndicator colors={colors} />}
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
    dispatch(setAvailableVisibility(!availableVisibility));
    dispatch(createCalendarEvents(null));
  };

  const handleScheduledVisibilityChange = () => {
    dispatch(setScheduledVisibility(!scheduledVisibility));
    dispatch(createCalendarEvents(null));
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
          icon: <Svg id={scheduledVisibility ? 'visibility-on' : 'visibility-off'} {...commonProps} />,
          action: handleScheduledVisibilityChange,
          tooltipTitle: t(scheduledVisibility ? 'hideFromCalendar' : 'showOnCalendar'),
          disabled: noScheduledEvents,
        },
      ],
      items: scheduledItems,
      title: t('scheduled'),
      type: ExpandedListTypes.Scheduled,
    },
    {
      buttons: [
        {
          icon: <Svg id={availableVisibility ? 'visibility-on' : 'visibility-off'} {...commonProps} />,
          action: handleAvailableVisibilityChange,
          tooltipTitle: t(availableVisibility ? 'hideFromCalendar' : 'showOnCalendar'),
          disabled: noAvailableEvents,
        },
      ],
      items: availableItems,
      title: t('alwaysAvailable'),
      isHiddenInLegend: noScheduledEvents && noAvailableEvents,
      allAvailableScheduled: noAvailableEvents && !noScheduledEvents,
      type: ExpandedListTypes.AlwaysAvailable,
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
      type: ExpandedListTypes.Deactivated,
    },
  ];
};
