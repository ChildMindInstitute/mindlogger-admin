import { render, screen } from '@testing-library/react';

import { ParticipantTag } from 'shared/consts';

import { ParticipantSnippet } from './ParticipantSnippet';

const dataTestid = 'test-id';
const props = {
  secretId: 'test secret id',
  nickname: 'test nickname',
  tag: 'Child' as ParticipantTag,
  'data-testid': dataTestid,
};

describe('ParticipantSnippet component', () => {
  test('should render the snippet', () => {
    render(<ParticipantSnippet {...props} />);

    expect(screen.getByText(props.secretId)).toBeInTheDocument();
    expect(screen.getByText(props.nickname)).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  test('should render with only the secretId', () => {
    render(<ParticipantSnippet secretId={props.secretId} />);

    expect(screen.getByText(props.secretId)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-nickname`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-tag`)).not.toBeInTheDocument();
  });
});
