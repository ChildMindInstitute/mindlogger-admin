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
  isCentered = true,
  deepPathCompare = false,
  defaultToFirstTab = true,
  animateTabIndicator = true,
}: TabsProps) => {
  const { t } = useTranslation('app');
  const { pathname } = useLocation();

  const { tabIndex, content, header } = useMemo(() => {
    const index = tabs?.findIndex(
      (tab) => tab.path && (deepPathCompare ? pathname === tab.path : pathname.includes(tab.path)),
    );
    const tabIndex = index === -1 && defaultToFirstTab ? 0 : index;

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
  }, [defaultToFirstTab, deepPathCompare, hiddenHeader, pathname, t, tabs]);

  return (
    <>
      <StyledTabs
        uiType={uiType}
        // Note: This is currently causing MUI to complain about -1 not being a
        // valid value when the user navigates to /dashboard/[applet_id]/settings.
        //
        // This is a temporary issue while the settings functionality is still a
        // separate route instead of appearing as a slideover, which will be
        // implemented in https://mindlogger.atlassian.net/browse/M2-5987.
        //
        // There is a note to remove this comment in that ticket when it is worked on.
        value={tabIndex}
        TabIndicatorProps={{
          children: <span />,
          ...(animateTabIndicator
            ? {}
            : {
                style: {
                  transition: 'none',
                },
              }),
        }}
        hiddenHeader={hiddenHeader}
        isBuilder={isBuilder}
        isCentered={isCentered}
        data-testid="linked-tabs"
      >
        {!hiddenHeader && header}
      </StyledTabs>
      {content}
    </>
  );
};
