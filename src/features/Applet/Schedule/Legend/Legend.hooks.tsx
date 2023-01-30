import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components';

import { Counter } from './Counter';
import { StyledCreateBtn, StyledDeactivated, StyledIndicator } from './Legend.styles';
import { getIndicatorColor, getTitle } from './Legend.utils';
import { Available, Schedules } from './Legend.const';

export const useExpandedLists = () => {
  const { t } = useTranslation('app');
  const commonProps = { width: 18, height: 18 };

  const [scheduledVisibility, setScheduledVisibility] = useState(true);
  const [availableVisibility, setAvailableVisibility] = useState(false);

  const availableItems = Object.values(Available).map((el) => (
    <Fragment key={el}>
      {availableVisibility && <StyledIndicator colors={getIndicatorColor(el)} />}
      {getTitle(el)}
    </Fragment>
  ));

  const deactivatedItems = [<StyledDeactivated>Draft 6</StyledDeactivated>];

  const scheduledItems = [
    <StyledCreateBtn>
      <Svg id="add" width={20} height={20} />
      {t('createEvent')}
    </StyledCreateBtn>,
    ...Object.values(Schedules).map((el) => (
      <Fragment key={el}>
        {scheduledVisibility && <StyledIndicator colors={getIndicatorColor(el)} />}
        {getTitle(el)}
        <Counter count={1} />
      </Fragment>
    )),
  ];

  return [
    {
      buttons: [
        {
          icon: <Svg id="clear-calendar" {...commonProps} />,
          action: () => null,
          tooltipTitle: t('clearAllScheduledEvents'),
        },
        {
          icon: (
            <Svg id={scheduledVisibility ? 'visibility-on' : 'visibility-off'} {...commonProps} />
          ),
          action: () => setScheduledVisibility((prev) => !prev),
          tooltipTitle: t('hideFromCalendar'),
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
        },
      ],
      items: availableItems,
      title: t('alwaysAvailable'),
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
