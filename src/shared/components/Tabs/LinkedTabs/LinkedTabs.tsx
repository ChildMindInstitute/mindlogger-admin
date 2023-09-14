import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Tab } from '@mui/material';

import { StyledTabs } from '../Tabs.styles';
import { TabPanel } from '../TabPanel';
import { RenderTabs, TabsProps, UiType } from '../Tabs.types';

export const LinkedTabs = ({ tabs, uiType = UiType.Primary, hiddenHeader = false }: TabsProps) => {
  const { t } = useTranslation('app');
  const { pathname } = useLocation();

  const { tabIndex, content, header } = useMemo(() => {
    const index = tabs?.findIndex((tab) => tab.path && pathname.includes(tab.path));
    const tabIndex = index > -1 ? index : 0;

    const { header, content } = tabs.reduce(
      (
        tabs: RenderTabs,
        {
          id,
          icon,
          activeIcon,
          labelKey,
          isMinHeightAuto,
          path,
          hasError,
          'data-testid': dataTestId,
        },
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
            data-testid={dataTestId}
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

    return { tabIndex, content, header };
  }, [pathname, t]);

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
