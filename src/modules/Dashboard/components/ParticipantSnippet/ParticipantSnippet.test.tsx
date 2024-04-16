import { render, screen } from '@testing-library/react';

import { ParticipantSnippet } from './ParticipantSnippet';

const props = {
  secretId: 'test secret id',
  nickname: 'test nickname',
  tag: 'test tag',
};

describe('ParticipantSnippet component', () => {
  test('should render the snippet', () => {
    render(<ParticipantSnippet {...props} />);

    expect(screen.getByText(props.secretId)).toBeInTheDocument();
    expect(screen.getByText(props.nickname)).toBeInTheDocument();
    expect(screen.getByText(props.tag)).toBeInTheDocument();
  });

  test('should render with only the secretId', () => {
    render(<ParticipantSnippet secretId={props.secretId} />);

    expect(screen.getByText(props.secretId)).toBeInTheDocument();
  })
});
