import { useState, SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';

import { TabPanel } from './TabPanel';
import { StyledTabs } from './Tabs.style';
import { TabsList } from './TabsList';

export const Tabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <StyledTabs
        value={tabIndex}
        onChange={handleChange}
        TabIndicatorProps={{ children: <span /> }}
        centered
      >
        {TabsList.map(({ icon, label }) => (
          <Tab key={label} icon={icon} label={label} />
        ))}
      </StyledTabs>
      {TabsList.map(({ content }, i) => (
        <TabPanel key={i} value={tabIndex} index={i}>
          {content}
        </TabPanel>
      ))}
    </>
  );
};
