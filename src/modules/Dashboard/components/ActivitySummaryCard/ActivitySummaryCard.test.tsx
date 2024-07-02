import { fireEvent, render, screen } from '@testing-library/react';
import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { ActionsMenu } from 'shared/components';

import { ActivitySummaryCard } from './ActivitySummaryCard';

const props = {
  actionsMenu: null,
  compliance: '88%',
  image: 'dummy-image.jpg',
  name: 'Test Activity',
  participantCount: '50',
  latestActivity: format(new Date('2024-01-01T00:00:00Z'), DateFormats.MonthDayYearTime),
};

describe('ActivitySummaryCard', () => {
  describe('When `showStats is `true`', () => {
    test('should render activity summary card props', () => {
      render(<ActivitySummaryCard showStats {...props} />);

      expect(screen.queryByAltText(props.name)).toBeInTheDocument();
      expect(screen.queryByText(props.name)).toBeInTheDocument();
      expect(screen.queryByText(props.compliance)).toBeInTheDocument();
      expect(screen.queryByText(props.participantCount)).toBeInTheDocument();
      expect(screen.queryByText(props.latestActivity)).toBeInTheDocument();
    });
  });

  describe('When `showStats is `true`', () => {
    test('should render activity summary card props', () => {
      render(<ActivitySummaryCard showStats={false} {...props} />);

      expect(screen.queryByAltText(props.name)).toBeInTheDocument();
      expect(screen.queryByText(props.name)).toBeInTheDocument();
      expect(screen.queryByText(props.compliance)).not.toBeInTheDocument();
      expect(screen.queryByText(props.participantCount)).not.toBeInTheDocument();
      expect(screen.queryByText(props.latestActivity)).not.toBeInTheDocument();
    });
  });

  test('should render actions menu and run action handler when clicked', () => {
    const testId = 'testMenu';
    const mockAction = jest.fn();
    const mockMenuItem = { title: 'test item', action: mockAction };
    const actionsMenu = <ActionsMenu menuItems={[mockMenuItem]} data-testid={testId} />;

    render(<ActivitySummaryCard {...props} actionsMenu={actionsMenu} />);

    fireEvent.click(screen.getByTestId(`${testId}-dots`));
    fireEvent.click(screen.getByText(mockMenuItem.title));

    expect(mockAction).toHaveBeenCalled();
  });
});
