import { useState, SyntheticEvent, useEffect, useRef } from 'react';
import { Tab, Badge, TabsActions } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TabPanel } from '../TabPanel';
import { StyledTabs } from '../Tabs.styles';
import { RenderTabs, TabsProps, UiType } from '../Tabs.types';

export const DefaultTabs = ({
  tabs,
  activeTab = 0,
  setActiveTab,
  uiType = UiType.Primary,
  animationDurationMs,
}: TabsProps) => {
  const { t } = useTranslation('app');
  const [tabIndex, setTabIndex] = useState(activeTab);
  const tabsActions = useRef<TabsActions | null>(null);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setActiveTab?.(newValue);
  };

  const { content, header } = tabs.reduce(
    (
      tabs: RenderTabs,
      {
        icon,
        activeIcon,
        labelKey,
        onClick,
        content,
        isMinHeightAuto,
        hasError,
        'data-testid': dataTestid,
      },
      index,
    ) => {
      tabs.header.push(
        <Tab
          key={labelKey}
          icon={
            <>
              {icon && tabIndex === index ? activeIcon : icon || undefined}
              {hasError && (
                <Badge
                  sx={{ right: 'auto', left: 0 }}
                  variant="dot"
                  invisible={!hasError}
                  color="error"
                />
              )}
            </>
          }
          label={t(labelKey)}
          onClick={onClick}
          data-testid={dataTestid}
        />,
      );
      tabs.content.push(
        <TabPanel key={index} value={tabIndex} index={index} isMinHeightAuto={isMinHeightAuto}>
          {content}
        </TabPanel>,
      );

      return tabs;
    },
    { header: [], content: [] },
  );

  useEffect(() => {
    if (!animationDurationMs || !tabsActions.current) return;

    // update the underline indicator position if there is an animation in the parent component
    const timeoutId = setTimeout(() => {
      tabsActions.current?.updateIndicator();
    }, animationDurationMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [animationDurationMs]);

  return (
    <>
      <StyledTabs
        uiType={uiType}
        defaultTabs
        value={tabIndex}
        onChange={handleChange}
        TabIndicatorProps={{ children: <span /> }}
        centered
        action={tabsActions}
      >
        {header}
      </StyledTabs>
      {content}
    </>
  );
};
