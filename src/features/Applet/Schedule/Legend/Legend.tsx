import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { Svg } from 'components';
import { SelectEvent } from 'types/event';

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
import { ExpandedList } from './ExpandedList';
import { SearchPopup } from './SearchPopup';
import { Search } from './Search';
import { SelectedRespondent } from './Legend.types';
import { useExpandedLists } from './Legend.hooks';

export const Legend = () => {
  const { t } = useTranslation('app');

  const [schedule, setSchedule] = useState<string>(scheduleOptions[0].value);
  const [searchPopupVisible, setSearchPopupVisible] = useState(false);
  const [selectedRespondent, setSelectedRespondent] = useState<SelectedRespondent>(null);

  const searchContainerRef = useRef<HTMLElement>(null);

  const expandedLists = useExpandedLists();
  const boundingBox = searchContainerRef?.current?.getBoundingClientRect();
  const isIndividual = schedule === ScheduleOptions.IndividualSchedule;

  const scheduleChangeHandler = async (e: SelectEvent) => {
    const { value } = e.target;
    await setSchedule(value);
    if (value === ScheduleOptions.IndividualSchedule) {
      setSearchPopupVisible(true);
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
          <StyledIconBtn>
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
        <StyledBtn>
          <Svg width={18} height={18} id="export2" />
          {t('export')}
        </StyledBtn>
      </StyledBtnsRow>
      {expandedLists?.map(({ buttons, items, title }) => (
        <ExpandedList key={title} buttons={buttons} items={items} title={title} />
      ))}
    </StyledLegend>
  );
};
