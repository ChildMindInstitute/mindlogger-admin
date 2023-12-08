import { render, fireEvent } from '@testing-library/react';

import { Accordion } from './Accordion';

describe('Accordion Component', () => {
  it('renders with the provided title', () => {
    const title = 'Accordion Title';
    const { getByText } = render(
      <Accordion title={title}>
        <></>
      </Accordion>,
    );
    expect(getByText(title)).toBeInTheDocument();
  });

  it('expands and collapses on click', () => {
    const title = 'Accordion Title';
    const accordionContent = 'Accordion Content';
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
