import { useState, SyntheticEvent } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

import { StyledTabs } from '../Tabs.styles';
import { TabPanel } from '../TabPanel';
import { RenderTabs, TabsProps, UiType } from '../Tabs.types';

export const LinkedTabs = ({
  tabs,
  uiType = UiType.Primary,
  hiddenHeader = false,
}: TabsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const location = useLocation();
  const currentIndex = tabs?.findIndex((el) => el.path === location.pathname);
  const [tabIndex, setTabIndex] = useState(currentIndex < 0 ? 0 : currentIndex);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { content, header } = tabs.reduce(
    (tabs: RenderTabs, { id, icon, activeIcon, labelKey, isMinHeightAuto, path }, index) => {
      tabs.header.push(
        <Tab
          key={index}
          component={Link}
          label={t(labelKey)}
          to={path || ''}
          icon={tabIndex === index ? activeIcon : icon}
        />,
      );
      tabs.content.push(
        <TabPanel
          id={id}
          key={index}
          value={tabIndex}
          index={index}
          isMinHeightAuto={isMinHeightAuto}
          hiddenHeader={hiddenHeader}
        >
          <Outlet />
        </TabPanel>,
      );

      return tabs;
    },
    { header: [], content: [] },
  );

  return (
    <>
      <StyledTabs
        uiType={uiType}
        value={tabIndex}
        onChange={handleChange}
        TabIndicatorProps={{ children: <span /> }}
        centered
        hiddenHeader={hiddenHeader}
      >
        {!hiddenHeader && header}
      </StyledTabs>
      {content}
    </>
  );
};
