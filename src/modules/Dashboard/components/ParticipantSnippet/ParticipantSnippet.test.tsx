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
  test('should render secretId followed by nickname if not team member', () => {
    render(<ParticipantSnippet {...props} />);

    const secretIdElement = screen.getByText(props.secretId);
    const nextSiblingElement = secretIdElement.nextSibling as ChildNode;

    expect(nextSiblingElement).toBeInTheDocument();
    expect(nextSiblingElement.textContent).toBe(props.nickname);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  test('should render only nickname if team member', () => {
    render(<ParticipantSnippet {...props} tag="Team" />);

    expect(screen.getByText(props.nickname)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-secretId`)).not.toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  test('should render with only the secretId', () => {
    render(<ParticipantSnippet secretId={props.secretId} />);

    expect(screen.getByText(props.secretId)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-nickname`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-tag`)).not.toBeInTheDocument();
  });
});
