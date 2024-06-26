import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { SelectController } from 'shared/components/FormComponents';
import { Spinner, Svg } from 'shared/components';
import { SelectEvent } from 'shared/types';
import { exportTemplate, getRespondentName, Mixpanel } from 'shared/utils';
import { AnalyticsCalendarPrefix } from 'shared/consts';
import { page } from 'resources';
import { users } from 'modules/Dashboard/state';

import { ExportSchedulePopup } from '../ExportSchedulePopup';
import { ImportSchedulePopup } from '../ImportSchedulePopup';
import { ClearScheduledEventsPopup } from '../ClearScheduledEventsPopup';
import { RemoveIndividualSchedulePopup } from '../RemoveIndividualSchedulePopup';
import { CreateEventPopup } from '../CreateEventPopup';
import { ExpandedList } from './ExpandedList';
import { SearchPopup } from './SearchPopup';
import { Search } from './Search';
import { ScheduleOptions, scheduleOptions, defaultExportHeader } from './Legend.const';
import {
  StyledBtn,
  StyledLegend,
  StyledBtnsRow,
  StyledSelect,
  StyledSearchContainer,
  StyledSelectRow,
  StyledIconBtn,
} from './Legend.styles';
import { LegendProps, SelectedRespondent } from './Legend.types';
import { useExpandedLists } from './Legend.hooks';

export const Legend = ({ legendEvents, appletName, appletId }: LegendProps) => {
  const { t } = useTranslation('app');
  const { respondentId } = useParams();
  const navigate = useNavigate();
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

  const [schedule, setSchedule] = useState<string | null>(null);
  const [searchPopupVisible, setSearchPopupVisible] = useState(false);
  const [selectedRespondent, setSelectedRespondent] = useState<SelectedRespondent>(null);
  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);
  const [importSchedulePopupVisible, setImportSchedulePopupVisible] = useState(false);
  const [clearScheduledEventsPopupVisible, setClearScheduledEventsPopupVisible] = useState(false);
  const [removeIndividualSchedulePopupVisible, setRemoveIndividualSchedulePopupVisible] =
    useState(false);
  const [createEventPopupVisible, setCreateEventPopupVisible] = useState(false);

  const searchContainerRef = useRef<HTMLElement>(null);

  const { scheduleExportTableData = [], scheduleExportCsv = [] } = legendEvents ?? {};
  const boundingBox = searchContainerRef?.current?.getBoundingClientRect();
  const isIndividual = schedule === ScheduleOptions.IndividualSchedule;
  const dataTestid = 'dashboard-calendar-schedule-legend';
  const analyticsPrefix = isIndividual
    ? AnalyticsCalendarPrefix.IndividualCalendar
    : AnalyticsCalendarPrefix.GeneralCalendar;

  const respondentName = getRespondentName(
    selectedRespondent?.secretId || '',
    selectedRespondent?.nickname,
  );

  const scheduleChangeHandler = async (event: SelectEvent) => {
    const { value } = event.target;
    await setSchedule(value);
    if (value === ScheduleOptions.IndividualSchedule) {
      setSearchPopupVisible(true);
      Mixpanel.track('View Individual calendar click', {
        'Applet ID': appletId,
      });
    } else {
      setSelectedRespondent(null);
      navigate(
        generatePath(page.appletSchedule, {
          appletId,
        }),
      );
      Mixpanel.track('View General calendar click', {
        'Applet ID': appletId,
      });
    }
  };

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
    if (isIndividual) {
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

    Mixpanel.track(`${analyticsPrefix} Schedule Import click`, {
      'Applet ID': appletId,
    });
  };

  useEffect(() => {
    setSchedule(
      respondentId ? ScheduleOptions.IndividualSchedule : ScheduleOptions.DefaultSchedule,
    );
  }, [respondentId]);

  useEffect(() => {
    if (!respondentId || selectedRespondent) return;

    const currentRespondent =
      respondentsItems?.find((respondent) => respondent?.id === respondentId) || null;
    setSelectedRespondent(currentRespondent);
  }, [respondentId, respondentsItems, selectedRespondent]);

  return schedule ? (
    <StyledLegend data-testid={dataTestid}>
      <StyledSelectRow>
        <StyledSelect>
          <SelectController
            name="schedule"
            value={schedule}
            customChange={scheduleChangeHandler}
            options={scheduleOptions}
            withChecked
            withGroups
            fullWidth
            SelectProps={{
              autoWidth: true,
            }}
            data-testid={`${dataTestid}-schedule`}
          />
        </StyledSelect>
        {isIndividual && (
          <StyledIconBtn
            onClick={() => setRemoveIndividualSchedulePopupVisible(true)}
            data-testid={`${dataTestid}-individual-remove`}
          >
            <Svg id="trash" />
          </StyledIconBtn>
        )}
      </StyledSelectRow>
      {isIndividual && (
        <>
          <StyledSearchContainer
            ref={searchContainerRef}
            onClick={() => setSearchPopupVisible(true)}
            data-testid={`${dataTestid}-individual-search`}
          >
            <Search selectedRespondent={selectedRespondent} placeholder={t('selectRespondent')} />
          </StyledSearchContainer>
          <SearchPopup
            top={boundingBox?.top}
            left={boundingBox?.left}
            open={searchPopupVisible}
            setSearchPopupVisible={setSearchPopupVisible}
            setSchedule={setSchedule}
            setSelectedRespondent={setSelectedRespondent}
            selectedRespondent={selectedRespondent}
            respondentsItems={respondentsItems}
            data-testid={`${dataTestid}-individual-search-popup`}
          />
        </>
      )}
      <StyledBtnsRow>
        <StyledBtn onClick={handleImportClick} data-testid={`${dataTestid}-import`}>
          <Svg width={18} height={18} id="export" />
          {t('import')}
        </StyledBtn>
        <StyledBtn onClick={exportScheduleHandler} data-testid={`${dataTestid}-export`}>
          <Svg width={18} height={18} id="export2" />
          {t('export')}
        </StyledBtn>
      </StyledBtnsRow>
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
          isIndividual={isIndividual}
          appletName={appletName}
          respondentName={respondentName}
          onClose={() => setImportSchedulePopupVisible(false)}
          onDownloadTemplate={handleExportScheduleSubmit(!isIndividual, false)}
          scheduleExportData={scheduleExportCsv}
          data-testid={`${dataTestid}-import-schedule-popup`}
        />
      )}
      {clearScheduledEventsPopupVisible && (
        <ClearScheduledEventsPopup
          open={clearScheduledEventsPopupVisible}
          appletName={appletName}
          appletId={appletId}
          isDefault={!isIndividual}
          name={respondentName}
          onClose={() => setClearScheduledEventsPopupVisible(false)}
          data-testid={`${dataTestid}-clear-scheduled-events-popup`}
        />
      )}
      {removeIndividualSchedulePopupVisible && (
        <RemoveIndividualSchedulePopup
          open={removeIndividualSchedulePopupVisible}
          name={respondentName}
          isEmpty={!scheduleExportTableData.length}
          onClose={() => setRemoveIndividualSchedulePopupVisible(false)}
          setSchedule={setSchedule}
          setSelectedRespondent={setSelectedRespondent}
          data-testid={`${dataTestid}-remove-individual-schedule-popup`}
        />
      )}
      <CreateEventPopup
        open={createEventPopupVisible}
        setCreateEventPopupVisible={setCreateEventPopupVisible}
        defaultStartDate={new Date()}
        data-testid={`${dataTestid}-create-event-popup`}
      />
    </StyledLegend>
  ) : (
    <Spinner />
  );
};
