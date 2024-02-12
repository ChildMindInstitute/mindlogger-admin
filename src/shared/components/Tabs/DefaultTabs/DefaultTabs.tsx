import { useState, SyntheticEvent, useEffect } from 'react';
import { Tab, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TabPanel } from '../TabPanel';
import { StyledTabs } from '../Tabs.styles';
import { RenderTabs, TabsProps, UiType } from '../Tabs.types';

export const DefaultTabs = ({
  tabs,
  activeTab = 0,
  setActiveTab,
  uiType = UiType.Primary,
}: TabsProps) => {
  const { t } = useTranslation('app');
  const [tabIndex, setTabIndex] = useState(activeTab);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
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
    setTabIndex(activeTab);
  }, [activeTab]);

  return (
    <>
      <StyledTabs
        uiType={uiType}
        defaultTabs
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
