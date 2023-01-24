import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { Svg } from 'components';

import { getExpandedLists, scheduleOptions } from './Legend.const';
import { StyledBtn, StyledFilter, StyledRow, StyledSelect } from './Legend.styles';
import { ExpandedList } from './ExpandedList';

export const Legend = () => {
  const { t } = useTranslation('app');
  const [schedule, setSchedule] = useState(scheduleOptions[0].value);

  return (
    <StyledFilter>
      <StyledSelect>
        <SelectController
          name="schedule"
          value={schedule}
          customChange={(e) => setSchedule(e.target.value)}
          options={scheduleOptions}
          SelectProps={{
            autoWidth: true,
            IconComponent: (props) => <Svg className={props.className} id="navigate-down" />,
          }}
        />
      </StyledSelect>
      <StyledRow>
        <StyledBtn>
          <Svg width={18} height={18} id="export" />
          {t('import')}
        </StyledBtn>
        <StyledBtn>
          <Svg width={18} height={18} id="export2" />
          {t('export')}
        </StyledBtn>
      </StyledRow>
      {getExpandedLists().map(({ buttons, items, title }) => (
        <ExpandedList key={title} buttons={buttons} items={items} title={title} />
      ))}
    </StyledFilter>
  );
};
