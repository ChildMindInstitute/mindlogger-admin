import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import theme from 'styles/theme';

import { mockedScheduleData } from './Schedule.const';
import { CreateActivityPopup } from './CreateActivityPopup';
import { ExportSchedulePopup } from './ExportSchedulePopup';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);
  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);

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
      </Box>
      <CreateActivityPopup
        open={createActivityPopupVisible}
        onClose={() => setCreateActivityPopupVisible(false)}
      />
      <ExportSchedulePopup
        open={exportDefaultSchedulePopupVisible}
        onClose={() => setExportDefaultSchedulePopupVisible(false)}
        onSubmit={() => setExportDefaultSchedulePopupVisible(false)}
        scheduleTableRows={mockedScheduleData}
      />
      <ExportSchedulePopup
        open={exportIndividualSchedulePopupVisible}
        onClose={() => setExportIndividualSchedulePopupVisible(false)}
        onSubmit={() => setExportIndividualSchedulePopupVisible(false)}
        scheduleTableRows={mockedScheduleData}
        secretUserId="012-435"
        nickName="John Doe"
      />
    </>
  );
};
