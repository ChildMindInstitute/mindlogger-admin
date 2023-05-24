import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { Accordion } from 'modules/Dashboard/components';

import { Scores } from './Scores';
import { subscales, scores } from './mock';
import { Subscale } from './Subscale';
import { AdditionalInformation } from './AdditionalInformation';

export const Subscales = () => (
  <Box sx={{ mb: theme.spacing(6.4) }}>
    <Scores {...scores} />
    {subscales?.map(({ name, id, items, additionalInformation }) => (
      <Accordion title={name} key={id}>
        <>
          {additionalInformation && (
            <Box sx={{ m: theme.spacing(4.8, 0) }}>
              <AdditionalInformation {...additionalInformation} />
            </Box>
          )}
          <Subscale items={items} />
        </>
      </Accordion>
    ))}
  </Box>
);
