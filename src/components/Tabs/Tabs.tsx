import { useState, SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

import { TabPanel } from './TabPanel';
import { StyledTabs } from './Tabs.styles';
import { TabsProps } from './Tabs.types';

export const Tabs = ({ tabs, activeTab }: TabsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <StyledTabs
        value={activeTab || tabIndex}
        onChange={handleChange}
        TabIndicatorProps={{ children: <span /> }}
        centered
      >
        {tabs.map(({ icon, activeIcon, labelKey, onClick }, index) => (
          <Tab
            key={labelKey}
            icon={tabIndex === index ? activeIcon : icon}
            label={t(labelKey)}
            onClick={onClick}
          />
        ))}
      </StyledTabs>
      {tabs.map(({ content }, i) => (
        <TabPanel key={i} value={activeTab || tabIndex} index={i}>
          {content}
        </TabPanel>
      ))}
    </>
  );
};
