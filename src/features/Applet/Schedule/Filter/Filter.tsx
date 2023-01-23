import { useState } from 'react';

import { SelectController } from 'components/FormComponents';

import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { Svg } from 'components';
import { getExpandedLists, options } from './Filter.const';
import { StyledBtn, StyledFilter, StyledRow, StyledSelect } from './Filter.styles';
import { ExpandedList } from './ExpandedList';

export const Filter = () => {
  const [schedule, setSchedule] = useState(options[0].value);

  return (
    <StyledFilter>
      <StyledSelect>
        <SelectController
          name="schedule"
          value={schedule}
          customChange={(e) => setSchedule(e.target.value)}
          options={options}
          SelectProps={{
            IconComponent: () => <Svg id="navigate-down" />,
          }}
        />
      </StyledSelect>
      <StyledRow>
        <StyledBtn>
          <Svg width={18} height={18} id="export" /> Import
        </StyledBtn>
        <StyledBtn>
          <Svg width={18} height={18} id="export2" />
          Export
        </StyledBtn>
      </StyledRow>

      {getExpandedLists().map(({ buttons, items, title }) => (
        <ExpandedList key={title} buttons={buttons} items={items} title={title} />
      ))}
    </StyledFilter>
  );
};
