import { useState, SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

import { TabPanel } from './TabPanel';
import { StyledTabs } from './Tabs.styles';
import { tabs } from './Tabs.const';

export const Tabs = () => {
  const { t } = useTranslation('app');
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
        {tabs.map(({ icon, activeIcon, labelKey }, index) => (
          <Tab key={labelKey} icon={tabIndex === index ? activeIcon : icon} label={t(labelKey)} />
        ))}
      </StyledTabs>
      {tabs.map(({ content }, i) => (
        <TabPanel key={i} value={tabIndex} index={i}>
          {content}
        </TabPanel>
      ))}
    </>
  );
};
