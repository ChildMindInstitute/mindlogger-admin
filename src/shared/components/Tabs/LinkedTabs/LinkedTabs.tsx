import { useMemo } from 'react';

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
  isBuilder = false,
}: TabsProps) => {
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
          onClick,
          'data-testid': dataTestId,
        },
        index,
      ) => {
        tabs.header.push(
          <Tab
            key={id}
            component={Link}
            label={t(labelKey)}
            to={path || ''}
            onClick={onClick}
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
            key={id}
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
  }, [pathname, t, tabs]);

  return (
    <>
      <StyledTabs
        uiType={uiType}
        value={tabIndex}
        TabIndicatorProps={{ children: <span /> }}
        centered
        hiddenHeader={hiddenHeader}
        isBuilder={isBuilder}
      >
        {!hiddenHeader && header}
      </StyledTabs>
      {content}
    </>
  );
};
