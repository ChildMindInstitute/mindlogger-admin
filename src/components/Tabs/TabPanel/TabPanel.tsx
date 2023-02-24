import { StyledPanel } from './TabPanel.style';
import { TabPanelProps } from './TabPanel.types';

export const TabPanel = ({
  children,
  value,
  index,
  hiddenHeader = false,
  ...other
}: TabPanelProps) => (
  <StyledPanel
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    hiddenHeader={hiddenHeader}
    {...other}
  >
    {value === index && children}
  </StyledPanel>
);
