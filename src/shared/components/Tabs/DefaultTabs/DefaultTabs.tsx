import { useState, SyntheticEvent } from 'react';
import { Tab, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TabPanel } from '../TabPanel';
import { StyledTabs } from '../Tabs.styles';
import { RenderTabs, TabsProps, UiType } from '../Tabs.types';

export const DefaultTabs = ({ tabs, activeTab, uiType = UiType.Primary }: TabsProps) => {
  const { t } = useTranslation('app');
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { content, header } = tabs.reduce(
    (
      tabs: RenderTabs,
      { icon, activeIcon, labelKey, onClick, content, isMinHeightAuto, hasError },
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
        />,
      );
      tabs.content.push(
        <TabPanel
          key={index}
          value={activeTab || tabIndex}
          index={index}
          isMinHeightAuto={isMinHeightAuto}
        >
          {content}
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
        defaultTabs
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
