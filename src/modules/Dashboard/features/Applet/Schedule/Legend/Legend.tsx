import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { exportTemplate, getRespondentName, Mixpanel } from 'shared/utils';
import { AnalyticsCalendarPrefix } from 'shared/consts';
import { users } from 'modules/Dashboard/state';
import { StyledFlexColumn, StyledFlexTopCenter, variables } from 'shared/styles';

import { ExportSchedulePopup } from '../ExportSchedulePopup';
import { ImportSchedulePopup } from '../ImportSchedulePopup';
import { ClearScheduledEventsPopup } from '../ClearScheduledEventsPopup';
import { CreateEventPopup } from '../CreateEventPopup';
import { ExpandedList } from './ExpandedList';
import { defaultExportHeader } from './Legend.const';
import { StyledLegend } from './Legend.styles';
import { LegendProps, SelectedRespondent } from './Legend.types';
import { useExpandedLists } from './Legend.hooks';
import { ScheduleToggle } from './ScheduleToggle';

export const Legend = ({
  appletId,
  appletName,
  canCreateIndividualSchedule = false,
  hasIndividualSchedule = false,
  legendEvents,
  userId,
  showScheduleToggle = false,
  ...otherProps
}: LegendProps) => {
  const { t } = useTranslation('app');
  const { result: respondentsData } = users.useAllRespondentsData() || {};
  const respondentsItems = respondentsData?.reduce(
    (acc: SelectedRespondent[], { id, details, isAnonymousRespondent }) => {
      const { respondentSecretId, hasIndividualSchedule, respondentNickname } = details?.[0] || {};

      if (!isAnonymousRespondent && id) {
        acc.push({
          icon: hasIndividualSchedule ? <Svg id="user-calendar" /> : null,
          id,
          secretId: respondentSecretId,
          nickname: respondentNickname,
          hasIndividualSchedule,
        });
      }

      return acc;
    },
    [],
  );

  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);
  const [importSchedulePopupVisible, setImportSchedulePopupVisible] = useState(false);
  const [clearScheduledEventsPopupVisible, setClearScheduledEventsPopupVisible] = useState(false);
  const [createEventPopupVisible, setCreateEventPopupVisible] = useState(false);
  const selectedRespondent =
    respondentsItems?.find((respondent) => respondent?.id === userId) || null;

  const { scheduleExportTableData = [], scheduleExportCsv = [] } = legendEvents ?? {};
  const dataTestid = 'dashboard-calendar-schedule-legend';
  const analyticsPrefix = hasIndividualSchedule
    ? AnalyticsCalendarPrefix.IndividualCalendar
    : AnalyticsCalendarPrefix.GeneralCalendar;

  const respondentName = getRespondentName(
    selectedRespondent?.secretId || '',
    selectedRespondent?.nickname,
  );

  const clearAllScheduledEventsAction = () => {
    setClearScheduledEventsPopupVisible(true);
  };

  const onCreateActivitySchedule = () => {
    setCreateEventPopupVisible(true);
  };

  const expandedLists = useExpandedLists(
    legendEvents,
    clearAllScheduledEventsAction,
    onCreateActivitySchedule,
  );

  const exportScheduleHandler = () => {
    if (hasIndividualSchedule) {
      setExportIndividualSchedulePopupVisible(true);
    } else {
      setExportDefaultSchedulePopupVisible(true);
    }
  };

  const handleExportScheduleSubmit = (isDefault: boolean, isExport: boolean) => async () => {
    const getFileName = () => {
      if (isExport) {
        return `${isDefault ? appletName : selectedRespondent?.secretId || ''}_schedule`;
      }

      return `${isDefault ? 'default' : 'individual'}_schedule_template`;
    };

    await exportTemplate({
      data: scheduleExportCsv,
      fileName: getFileName(),
      defaultData: scheduleExportCsv.length > 0 ? null : defaultExportHeader,
    });

    isExport && setExportDefaultSchedulePopupVisible(false);
  };

  const handleImportClick = () => {
    setImportSchedulePopupVisible(true);

    Mixpanel.track(`${analyticsPrefix} Schedule Import click`);
  };

  return (
    <StyledLegend {...otherProps} data-testid={dataTestid}>
      <StyledFlexColumn sx={{ gap: 1.8, pb: 0.8 }}>
        <StyledFlexTopCenter sx={{ placeContent: 'space-between' }}>
          <Box
            component="p"
            data-testid={`${dataTestid}-schedule`}
            sx={{ fontSize: variables.font.size.xl, m: 0, py: 0.7 }}
          >
            {hasIndividualSchedule ? t('individualSchedule') : t('defaultSchedule')}
          </Box>

          {showScheduleToggle && (
            <ScheduleToggle
              appletId={appletId}
              data-testid={`${dataTestid}-schedule-toggle`}
              disabled={!canCreateIndividualSchedule}
              isEmpty={!!scheduleExportTableData.length}
              isIndividual={hasIndividualSchedule}
              userId={userId}
              userName={respondentName}
            />
          )}
        </StyledFlexTopCenter>

        <StyledFlexTopCenter sx={{ gap: 0.4, placeContent: 'flex-end' }}>
          <Button
            startIcon={<Svg fill="currentColor" width={18} height={18} id="export" />}
            onClick={handleImportClick}
            data-testid={`${dataTestid}-import`}
            variant="text"
          >
            {t('import')}
          </Button>

          <Button
            startIcon={<Svg fill="currentColor" width={18} height={18} id="export2" />}
            onClick={exportScheduleHandler}
            data-testid={`${dataTestid}-export`}
            variant="text"
          >
            {t('export')}
          </Button>
        </StyledFlexTopCenter>
      </StyledFlexColumn>

      {expandedLists?.map(
        ({ buttons, items, title, allAvailableScheduled, isHiddenInLegend, type }) => (
          <ExpandedList
            key={title}
            buttons={buttons}
            items={items}
            title={title}
            isHiddenInLegend={isHiddenInLegend}
            allAvailableScheduled={allAvailableScheduled}
            data-testid={`${dataTestid}-${type}`}
          />
        ),
      )}
      {exportDefaultSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportDefaultSchedulePopupVisible}
          onClose={() => setExportDefaultSchedulePopupVisible(false)}
          onSubmit={handleExportScheduleSubmit(true, true)}
          scheduleTableRows={scheduleExportTableData}
          data-testid={`${dataTestid}-export-default-schedule-popup`}
        />
      )}
      {exportIndividualSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportIndividualSchedulePopupVisible}
          onClose={() => setExportIndividualSchedulePopupVisible(false)}
          onSubmit={handleExportScheduleSubmit(false, true)}
          respondentName={respondentName}
          scheduleTableRows={scheduleExportTableData}
          data-testid={`${dataTestid}-export-individual-schedule-popup`}
        />
      )}
      {importSchedulePopupVisible && (
        <ImportSchedulePopup
          open={importSchedulePopupVisible}
          isIndividual={hasIndividualSchedule}
          appletName={appletName}
          respondentId={userId}
          respondentName={respondentName}
          onClose={() => setImportSchedulePopupVisible(false)}
          onDownloadTemplate={handleExportScheduleSubmit(!hasIndividualSchedule, false)}
          scheduleExportData={scheduleExportCsv}
          data-testid={`${dataTestid}-import-schedule-popup`}
        />
      )}
      {clearScheduledEventsPopupVisible && (
        <ClearScheduledEventsPopup
          appletId={appletId}
          appletName={appletName}
          data-testid={`${dataTestid}-clear-scheduled-events-popup`}
          name={respondentName}
          onClose={() => setClearScheduledEventsPopupVisible(false)}
          open={clearScheduledEventsPopupVisible}
          userId={userId}
        />
      )}

      <CreateEventPopup
        data-testid={`${dataTestid}-create-event-popup`}
        defaultStartDate={new Date()}
        open={createEventPopupVisible}
        setCreateEventPopupVisible={setCreateEventPopupVisible}
        userId={userId}
      />
    </StyledLegend>
  );
};
