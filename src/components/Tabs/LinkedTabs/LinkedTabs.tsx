import { useState, SyntheticEvent } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

import { StyledTabs } from '../Tabs.styles';
import { TabPanel } from '../TabPanel';
import { RenderTabs, TabsProps } from '../Tabs.types';

export const LinkedTabs = ({ tabs }: TabsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const location = useLocation();
  const currentIndex = tabs?.findIndex((el) => el.path === location.pathname);
  const [tabIndex, setTabIndex] = useState(currentIndex < 0 ? tabs.length - 1 : currentIndex);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { content, header } = tabs.reduce(
    (acc: RenderTabs, { icon, activeIcon, labelKey, isMinHeightAuto, path }, index) => {
      acc.header.push(
        <Tab
          key={index}
          component={Link}
          label={t(labelKey)}
          to={path || ''}
          icon={tabIndex === index ? activeIcon : icon}
        />,
      );
      acc.content.push(
        <TabPanel key={index} value={tabIndex} index={index} isMinHeightAuto={isMinHeightAuto}>
          <Outlet />
        </TabPanel>,
      );

      return acc;
    },
    { header: [], content: [] },
  );

  return (
    <>
      <StyledTabs
        value={tabIndex}
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
