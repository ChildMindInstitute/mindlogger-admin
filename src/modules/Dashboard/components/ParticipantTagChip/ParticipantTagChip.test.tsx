import React from 'react';
import { render } from '@testing-library/react';

import { ParticipantTag } from 'shared/consts';

import { ParticipantTagChip } from './ParticipantTagChip';

describe('ParticipantTagChip', () => {
  test('renders the translated tag name', () => {
    const tag = ParticipantTag.Child;
    const { getByText } = render(<ParticipantTagChip tag={tag} />);
    expect(getByText('Child')).toBeInTheDocument();
  });

  test('returns untranslated tag name if nonstandard tag', () => {
    const tag = 'nonstandard tag' as ParticipantTag;
    const { getByText } = render(<ParticipantTagChip tag={tag} />);
    expect(getByText(tag)).toBeInTheDocument();
  });

  test('returns nothing if tag is falsy', () => {
    const { container, rerender } = render(<ParticipantTagChip tag={ParticipantTag.None} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ParticipantTagChip tag={null} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ParticipantTagChip />);
    expect(container).toBeEmptyDOMElement();
  });
});
