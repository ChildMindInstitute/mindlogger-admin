import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import theme from 'styles/theme';

import { mockedScheduleData } from './Schedule.const';
import { CreateActivityPopup } from './CreateActivityPopup';
import { ExportSchedulePopup } from './ExportSchedulePopup';
import { RemoveIndividualSchedulePopup } from './RemoveIndividualSchedulePopup';
import { ClearScheduledEventsPopup } from './ClearScheduledEventsPopup';
import { EditActivityPopup } from './EditActivityPopup';
import { RemoveScheduledEventPopup } from './RemoveScheduledEventPopup';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);
  const [editActivityPopupVisible, setEditActivityPopupVisible] = useState(false);
  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);
  const [removeIndividualSchedulePopupVisible, setRemoveIndividualSchedulePopupVisible] =
    useState(false);
  const [clearScheduleEventsPopupVisible, setClearScheduleEventsPopupVisible] = useState(false);
  const [removeScheduledEventPopupVisible, setRemoveScheduledEventPopupVisible] = useState(false);

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  return (
    <>
      <Box>
        <Button
          sx={{ marginRight: theme.spacing(1.5) }}
          onClick={() => setCreateActivityPopupVisible(true)}
        >
          Create Activity Schedule
        </Button>
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
      </Box>
      {createActivityPopupVisible && (
        <CreateActivityPopup
          open={createActivityPopupVisible}
          onClose={() => setCreateActivityPopupVisible(false)}
        />
      )}
      {editActivityPopupVisible && (
        <EditActivityPopup
          open={editActivityPopupVisible}
          onClose={() => setEditActivityPopupVisible(false)}
          setRemoveEventPopupVisible={setRemoveScheduledEventPopupVisible}
        />
      )}
      {removeScheduledEventPopupVisible && (
        <RemoveScheduledEventPopup
          open={removeScheduledEventPopupVisible}
          onClose={() => setRemoveScheduledEventPopupVisible(false)}
          onSubmit={() => setRemoveScheduledEventPopupVisible(false)}
          activityName="Daily Journal"
        />
      )}
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
    </>
  );
};
