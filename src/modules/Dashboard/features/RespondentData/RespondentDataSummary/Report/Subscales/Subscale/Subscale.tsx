import { Fragment } from 'react';
import { Box } from '@mui/material';

import { Accordion } from 'modules/Dashboard/components';
import { theme } from 'shared/styles';

import { ReportTable } from '../../ReportTable';
import { AdditionalInformation } from '../AdditionalInformation';
import { SubscalesTypes } from '../Subscales.types';
import { SubscaleProps } from './Subscale.types';

export const Subscale = ({ items }: SubscaleProps) => {
  const renderItem = (type?: SubscalesTypes) => {
    switch (type) {
      case SubscalesTypes.Table:
        return <ReportTable />;

      default:
        return null;
    }
  };

  return (
    <>
      {items?.map(({ type, id, name, items, additionalInformation }) => (
        <Fragment key={id}>
          {items?.length ? (
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
          ) : (
            <>
              {additionalInformation && (
                <Box sx={{ m: theme.spacing(4.8, 0) }}>
                  <AdditionalInformation {...additionalInformation} />
                </Box>
              )}
              <>{renderItem(type)}</>
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};
