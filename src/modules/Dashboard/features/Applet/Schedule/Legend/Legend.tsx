import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { SelectController } from 'shared/components/FormComponents';
import { Spinner, Svg } from 'shared/components';
import { SelectEvent } from 'shared/types';
import { exportToCsv, getRespondentName } from 'shared/utils';
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
import { ScheduleOptions, scheduleOptions } from './Legend.const';
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
  const respondentsItems = respondentsData?.map(
    ({ id, hasIndividualSchedule, secretId, nickname }) => ({
      icon: hasIndividualSchedule ? <Svg id="user-calendar" /> : null,
      id,
      secretId,
      nickname,
      hasIndividualSchedule,
    }),
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

  const respondentName = getRespondentName(
    selectedRespondent?.secretId || '',
    selectedRespondent?.nickname,
  );

  const scheduleChangeHandler = async (e: SelectEvent) => {
    const { value } = e.target;
    await setSchedule(value);
    if (value === ScheduleOptions.IndividualSchedule) {
      setSearchPopupVisible(true);
    } else {
      setSelectedRespondent(null);
      navigate(
        generatePath(page.appletSchedule, {
          appletId,
        }),
      );
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

    await exportToCsv(scheduleExportCsv, getFileName());
    isExport && setExportDefaultSchedulePopupVisible(false);
  };

  useEffect(() => {
    setSchedule(
      respondentId ? ScheduleOptions.IndividualSchedule : ScheduleOptions.DefaultSchedule,
    );
  }, [respondentId]);

  useEffect(() => {
    if (respondentId && respondentsItems?.length && !selectedRespondent) {
      setSelectedRespondent(
        respondentsItems.find((respondent) => respondent.id === respondentId) || null,
      );
    }
  }, [respondentId, respondentsItems, selectedRespondent]);

  return schedule ? (
    <StyledLegend>
      <StyledSelectRow>
        <StyledSelect>
          <SelectController
            name="schedule"
            value={schedule}
            customChange={scheduleChangeHandler}
            options={scheduleOptions}
            withChecked
            SelectProps={{
              autoWidth: true,
              IconComponent: (props) => <Svg className={props.className} id="navigate-down" />,
            }}
          />
        </StyledSelect>
        {isIndividual && (
          <StyledIconBtn onClick={() => setRemoveIndividualSchedulePopupVisible(true)}>
            <Svg id="trash" />
          </StyledIconBtn>
        )}
      </StyledSelectRow>
      {isIndividual && (
        <>
          <StyledSearchContainer
            ref={searchContainerRef}
            onClick={() => setSearchPopupVisible(true)}
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
          />
        </>
      )}
      <StyledBtnsRow>
        <StyledBtn onClick={() => setImportSchedulePopupVisible(true)}>
          <Svg width={18} height={18} id="export" />
          {t('import')}
        </StyledBtn>
        <StyledBtn onClick={exportScheduleHandler}>
          <Svg width={18} height={18} id="export2" />
          {t('export')}
        </StyledBtn>
      </StyledBtnsRow>
      {expandedLists?.map(({ buttons, items, title, allAvailableScheduled, isHiddenInLegend }) => (
        <ExpandedList
          key={title}
          buttons={buttons}
          items={items}
          title={title}
          isHiddenInLegend={isHiddenInLegend}
          allAvailableScheduled={allAvailableScheduled}
        />
      ))}
      {exportDefaultSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportDefaultSchedulePopupVisible}
          onClose={() => setExportDefaultSchedulePopupVisible(false)}
          onSubmit={handleExportScheduleSubmit(true, true)}
          scheduleTableRows={scheduleExportTableData}
        />
      )}
      {exportIndividualSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportIndividualSchedulePopupVisible}
          onClose={() => setExportIndividualSchedulePopupVisible(false)}
          onSubmit={handleExportScheduleSubmit(false, true)}
          respondentName={respondentName}
          scheduleTableRows={scheduleExportTableData}
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
        />
      )}
      <CreateEventPopup
        open={createEventPopupVisible}
        setCreateEventPopupVisible={setCreateEventPopupVisible}
        defaultStartDate={new Date()}
      />
    </StyledLegend>
  ) : (
    <Spinner />
  );
};
