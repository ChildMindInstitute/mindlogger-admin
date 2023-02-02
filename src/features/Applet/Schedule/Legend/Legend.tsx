import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { Svg } from 'components';
import { SelectEvent } from 'types/event';

import { mockedScheduleData, ScheduleOptions, scheduleOptions } from './Legend.const';
import {
  StyledBtn,
  StyledLegend,
  StyledBtnsRow,
  StyledSelect,
  StyledSearchContainer,
  StyledSelectRow,
  StyledIconBtn,
} from './Legend.styles';
import { ExpandedList } from './ExpandedList';
import { SearchPopup } from './SearchPopup';
import { Search } from './Search';
import { SelectedRespondent } from './Legend.types';
import { useExpandedLists } from './Legend.hooks';
import { ExportSchedulePopup } from '../ExportSchedulePopup';
import { ClearScheduledEventsPopup } from '../ClearScheduledEventsPopup';
import { RemoveIndividualSchedulePopup } from '../RemoveIndividualSchedulePopup';
import { CreateActivityPopup } from '../CreateActivityPopup';

export const Legend = () => {
  const { t } = useTranslation('app');

  const [schedule, setSchedule] = useState<string>(scheduleOptions[0].value);
  const [searchPopupVisible, setSearchPopupVisible] = useState(false);
  const [selectedRespondent, setSelectedRespondent] = useState<SelectedRespondent>(null);
  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);
  const [clearScheduleEventsPopupVisible, setClearScheduleEventsPopupVisible] = useState(false);
  const [removeIndividualSchedulePopupVisible, setRemoveIndividualSchedulePopupVisible] =
    useState(false);
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);

  const searchContainerRef = useRef<HTMLElement>(null);

  const boundingBox = searchContainerRef?.current?.getBoundingClientRect();
  const isIndividual = schedule === ScheduleOptions.IndividualSchedule;

  const scheduleChangeHandler = async (e: SelectEvent) => {
    const { value } = e.target;
    await setSchedule(value);
    if (value === ScheduleOptions.IndividualSchedule) {
      setSearchPopupVisible(true);
    }
  };

  const clearAllScheduledEventsAction = () => {
    setClearScheduleEventsPopupVisible(true);
  };

  const onCreateActivitySchedule = () => {
    setCreateActivityPopupVisible(true);
  };

  const expandedLists = useExpandedLists(clearAllScheduledEventsAction, onCreateActivitySchedule);

  const exportScheduleHandler = () => {
    if (isIndividual) {
      setExportIndividualSchedulePopupVisible(true);
    } else {
      setExportDefaultSchedulePopupVisible(true);
    }
  };

  return (
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
            onClose={() => setSearchPopupVisible(false)}
            setSelectedRespondent={setSelectedRespondent}
            selectedRespondent={selectedRespondent}
          />
        </>
      )}
      <StyledBtnsRow>
        <StyledBtn>
          <Svg width={18} height={18} id="export" />
          {t('import')}
        </StyledBtn>
        <StyledBtn onClick={exportScheduleHandler}>
          <Svg width={18} height={18} id="export2" />
          {t('export')}
        </StyledBtn>
      </StyledBtnsRow>
      {expandedLists?.map(({ buttons, items, title }) => (
        <ExpandedList key={title} buttons={buttons} items={items} title={title} />
      ))}
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
      {clearScheduleEventsPopupVisible && (
        <ClearScheduledEventsPopup
          open={clearScheduleEventsPopupVisible}
          appletName="Pediatric Screener"
          isDefault={!isIndividual}
          name="John Doe"
          onClose={() => setClearScheduleEventsPopupVisible(false)}
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
      <CreateActivityPopup
        open={createActivityPopupVisible}
        onClose={() => setCreateActivityPopupVisible(false)}
        setCreateActivityPopupVisible={setCreateActivityPopupVisible}
        activityName="Daily Journal"
      />
    </StyledLegend>
  );
};
