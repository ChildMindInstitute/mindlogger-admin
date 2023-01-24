import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { Svg } from 'components';

import { getExpandedLists, scheduleOptions } from './Filter.const';
import { StyledBtn, StyledFilter, StyledRow, StyledSelect } from './Filter.styles';
import { ExpandedList } from './ExpandedList';

export const Filter = () => {
  const { t } = useTranslation('app');
  const [schedule, setSchedule] = useState(scheduleOptions[0].value);

  return (
    <StyledFilter>
      <StyledSelect>
        <SelectController
          name="schedule"
          fullWidth
          value={schedule}
          customChange={(e) => setSchedule(e.target.value)}
          options={scheduleOptions}
          SelectProps={{
            IconComponent: () => <Svg id="navigate-down" />,
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
