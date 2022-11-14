import Box from '@mui/material/Box';

import { StyledPanel } from './TabPanel.style';
import { TabPanelProps } from './TabPanel.types';

export const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <StyledPanel
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && <Box>{children}</Box>}
  </StyledPanel>
);
