import { useState, SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

import { TabPanel } from './TabPanel';
import { StyledTabs } from './Tabs.styles';
import { RenderTabs, TabsProps } from './Tabs.types';

export const Tabs = ({ tabs, activeTab }: TabsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { content, header } = tabs.reduce(
    (acc: RenderTabs, { icon, activeIcon, labelKey, onClick, content, isMinHeightAuto }, index) => {
      acc.header.push(
        <Tab
          key={labelKey}
          icon={tabIndex === index ? activeIcon : icon}
          label={t(labelKey)}
          onClick={onClick}
        />,
      );
      acc.content.push(
        <TabPanel
          key={index}
          value={activeTab || tabIndex}
          index={index}
          isMinHeightAuto={isMinHeightAuto}
        >
          {content}
        </TabPanel>,
      );

      return acc;
    },
    { header: [], content: [] },
  );

  return (
    <>
      <StyledTabs
        value={activeTab || tabIndex}
        onChange={handleChange}
        TabIndicatorProps={{ children: <span /> }}
        centered
      >
        {header}
      </StyledTabs>
      {content}
    </>
  );
};
