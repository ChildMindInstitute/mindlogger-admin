import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { exportTemplate, Mixpanel } from 'shared/utils';
import { AnalyticsCalendarPrefix } from 'shared/consts';
import { StyledFlexColumn, StyledFlexTopCenter, variables } from 'shared/styles';

import { ExportSchedulePopup } from '../ExportSchedulePopup';
import { ImportSchedulePopup } from '../ImportSchedulePopup';
import { ExpandedList } from './ExpandedList';
import { defaultExportHeader } from './Legend.const';
import { StyledLegend } from './Legend.styles';
import { LegendProps } from './Legend.types';
import { useExpandedLists } from './Legend.hooks';
import { ScheduleToggle } from './ScheduleToggle';
import { useSchedule } from '../ScheduleProvider/ScheduleProvider.hooks';

export const Legend = ({
  legendEvents,
  showScheduleToggle = false,
  ...otherProps
}: LegendProps) => {
  const { t } = useTranslation('app');
  const [showExportSchedulePopup, setShowExportSchedulePopup] = useState(false);
  const [importSchedulePopupVisible, setImportSchedulePopupVisible] = useState(false);
  const {
    appletId,
    appletName,
    canCreateIndividualSchedule,
    hasIndividualSchedule,
    onClickClearEvents,
    onClickCreateEvent,
    participantName,
    participantSecretId,
    userId,
  } = useSchedule();
  const expandedLists = useExpandedLists(legendEvents, onClickClearEvents, onClickCreateEvent);

  const { scheduleExportTableData = [], scheduleExportCsv = [] } = legendEvents ?? {};
  const dataTestid = 'dashboard-calendar-schedule-legend';
  const analyticsPrefix = hasIndividualSchedule
    ? AnalyticsCalendarPrefix.IndividualCalendar
    : AnalyticsCalendarPrefix.GeneralCalendar;

  const handleExportScheduleSubmit = (isDefault: boolean, isExport: boolean) => async () => {
    const getFileName = () => {
      if (isExport) {
        return `${isDefault ? appletName : participantSecretId || ''}_schedule`;
      }

      return `${isDefault ? 'default' : 'individual'}_schedule_template`;
    };

    await exportTemplate({
      data: scheduleExportCsv,
      fileName: getFileName(),
      defaultData: scheduleExportCsv.length > 0 ? null : defaultExportHeader,
    });

    isExport && setShowExportSchedulePopup(false);
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
              userName={participantName}
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
            onClick={() => {
              setShowExportSchedulePopup(true);
            }}
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

      {showExportSchedulePopup && (
        <ExportSchedulePopup
          data-testid={`${dataTestid}-export-${
            hasIndividualSchedule ? 'individual' : 'default'
          }-schedule-popup`}
          onClose={() => {
            setShowExportSchedulePopup(false);
          }}
          onSubmit={handleExportScheduleSubmit(!hasIndividualSchedule, true)}
          open={showExportSchedulePopup}
          respondentName={participantName}
          scheduleTableRows={scheduleExportTableData}
        />
      )}

      {importSchedulePopupVisible && (
        <ImportSchedulePopup
          open={importSchedulePopupVisible}
          isIndividual={hasIndividualSchedule}
          appletName={appletName}
          respondentId={userId}
          respondentName={participantName}
          onClose={() => setImportSchedulePopupVisible(false)}
          onDownloadTemplate={handleExportScheduleSubmit(!hasIndividualSchedule, false)}
          scheduleExportData={scheduleExportCsv}
          data-testid={`${dataTestid}-import-schedule-popup`}
        />
      )}
    </StyledLegend>
  );
};
