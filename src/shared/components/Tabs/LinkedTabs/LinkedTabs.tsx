import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Tab } from '@mui/material';

import { StyledTabs } from '../Tabs.styles';
import { TabPanel } from '../TabPanel';
import { RenderTabs, TabsProps, UiType } from '../Tabs.types';

export const LinkedTabs = ({
  tabs,
  uiType = UiType.Primary,
  hiddenHeader = false,
}: TabsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const { pathname } = useLocation();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    // TODO: investigate negative tabIndex
    const tabIndex = tabs?.findIndex((tab) => tab.path && pathname.includes(tab.path));
    setTabIndex(tabIndex > -1 ? tabIndex : 0);
  }, [pathname]);

  const { content, header } = tabs.reduce(
    (
      tabs: RenderTabs,
      { id, icon, activeIcon, labelKey, isMinHeightAuto, path, hasError },
      index,
    ) => {
      tabs.header.push(
        <Tab
          key={index}
          component={Link}
          label={t(labelKey)}
          to={path || ''}
          icon={
            <>
              {tabIndex === index ? activeIcon : icon}
              {hasError && <Badge variant="dot" invisible={!hasError} color="error" />}
            </>
          }
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
