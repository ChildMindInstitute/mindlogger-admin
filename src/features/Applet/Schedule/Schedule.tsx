import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import theme from 'styles/theme';

import { Calendar } from './Calendar';
import { mockedScheduleData } from './Schedule.const';
import { ExportSchedulePopup } from './ExportSchedulePopup';
import { RemoveIndividualSchedulePopup } from './RemoveIndividualSchedulePopup';
import { ClearScheduledEventsPopup } from './ClearScheduledEventsPopup';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);
  const [removeIndividualSchedulePopupVisible, setRemoveIndividualSchedulePopupVisible] =
    useState(false);
  const [clearScheduleEventsPopupVisible, setClearScheduleEventsPopupVisible] = useState(false);

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Button
          sx={{ marginRight: theme.spacing(1.5) }}
          onClick={() => setExportDefaultSchedulePopupVisible(true)}
        >
          Export Default Schedule
        </Button>
        <Button
          sx={{ marginRight: theme.spacing(1.5) }}
          onClick={() => setExportIndividualSchedulePopupVisible(true)}
        >
          Export Individual Schedule
        </Button>
        <Button
          sx={{ marginRight: theme.spacing(1.5) }}
          onClick={() => setRemoveIndividualSchedulePopupVisible(true)}
        >
          Remove Individual Schedule
        </Button>
        <Button
          sx={{ marginRight: theme.spacing(1.5) }}
          onClick={() => setClearScheduleEventsPopupVisible(true)}
        >
          Clear Schedule Events
        </Button>
      </StyledLeftPanel>
      <Calendar />
      {exportDefaultSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportDefaultSchedulePopupVisible}
          onClose={() => setExportDefaultSchedulePopupVisible(false)}
          onSubmit={() => setExportDefaultSchedulePopupVisible(false)}
          scheduleTableRows={mockedScheduleData}
        />
      )}
      {exportIndividualSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportIndividualSchedulePopupVisible}
          onClose={() => setExportIndividualSchedulePopupVisible(false)}
          onSubmit={() => setExportIndividualSchedulePopupVisible(false)}
          scheduleTableRows={mockedScheduleData}
          secretUserId="012-435"
          nickName="John Doe"
        />
      )}
      {removeIndividualSchedulePopupVisible && (
        <RemoveIndividualSchedulePopup
          open={removeIndividualSchedulePopupVisible}
          name="John Doe"
          isEmpty={false}
          onClose={() => setRemoveIndividualSchedulePopupVisible(false)}
        />
      )}
      {clearScheduleEventsPopupVisible && (
        <ClearScheduledEventsPopup
          open={clearScheduleEventsPopupVisible}
          appletName="Pediatric Screener"
          isDefault={true}
          name="John Doe"
          onClose={() => setClearScheduleEventsPopupVisible(false)}
        />
      )}
    </StyledSchedule>
  );
};
