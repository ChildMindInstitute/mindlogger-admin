import { Fragment } from 'react';

import { Accordion } from 'modules/Dashboard/components';

import { ReportTable } from '../../ReportTable';
import { SubscalesTypes } from '../Subscales.const';
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
      {items?.map(({ type, id, name, items }) => (
        <Fragment key={id}>
          {items?.length ? (
            <Accordion title={name} key={id}>
              <Subscale items={items} />
            </Accordion>
          ) : (
            renderItem(type)
          )}
        </Fragment>
      ))}
    </>
  );
};
