import { Accordion } from 'modules/Dashboard/components';

import { subscales } from './Subscales.const';
import { Subscale } from './Subscale';

export const Subscales = () => (
  <>
    {subscales?.map(({ name, id, items }) => (
      <Accordion title={name} key={id}>
        <Subscale items={items} />
      </Accordion>
    ))}
  </>
);
