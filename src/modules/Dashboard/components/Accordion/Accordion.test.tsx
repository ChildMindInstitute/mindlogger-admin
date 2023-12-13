import { render, fireEvent } from '@testing-library/react';

import { Accordion } from './Accordion';

const title = 'Accordion Title';
const accordionContent = 'Accordion Content';

describe('Accordion Component', () => {
  test('renders with the provided title', () => {
    const { getByText } = render(
      <Accordion title={title}>
        <></>
      </Accordion>,
    );
    expect(getByText(title)).toBeInTheDocument();
  });

  test('expands and collapses on click', () => {
    const { getByText, queryByText } = render(
      <Accordion title={title}>
        <>{accordionContent}</>
      </Accordion>,
    );

    expect(queryByText(accordionContent)).not.toBeInTheDocument();
    fireEvent.click(getByText(title));
    expect(getByText(accordionContent)).toBeInTheDocument();
    fireEvent.click(getByText(title));
    expect(queryByText(accordionContent)).not.toBeInTheDocument();
  });
});
