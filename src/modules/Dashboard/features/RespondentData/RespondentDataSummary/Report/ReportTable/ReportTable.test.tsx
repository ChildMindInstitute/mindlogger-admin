/* eslint-disable quotes */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { ItemResponseType } from 'shared/consts';

import { ReportTable } from './ReportTable';

const answers = [
  {
    answer: {
      value: 'First Mocked Answer',
      text: null,
    },
    date: '2024-01-08T18:31:02.847000',
  },
  {
    answer: {
      value: 'Second Mocked Answer',
      text: null,
    },
    date: '2024-01-09T14:13:42.383000',
  },
];
const timeRangeAnswers = [
  {
    answer: {
      value: {
        from: '',
        to: '',
      },
      text: null,
    },
    date: '2024-01-08T18:31:02.847000',
  },
];

const ascSortedByResponse = ['First Mocked Answer', 'Second Mocked Answer'];

describe('ReportFilters', () => {
  test('renders empty state for report table when no answers', async () => {
    renderWithProviders(<ReportTable responseType={ItemResponseType.Text} />);

    expect(
      screen.getByText("No match was found for ''. Try a different search word or phrase."),
    ).toBeInTheDocument();
  });

  test('renders proper header for report when type is time range', async () => {
    renderWithProviders(
      <ReportTable responseType={ItemResponseType.TimeRange} answers={timeRangeAnswers} />,
    );

    // check table header
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Start Time Response')).toBeInTheDocument();
    expect(screen.getByText('End Time Response')).toBeInTheDocument();
  });

  test('search in the table', async () => {
    renderWithProviders(
      <ReportTable
        responseType={ItemResponseType.Text}
        data-testid="response-option"
        answers={answers}
      />,
    );

    // check table header
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Response')).toBeInTheDocument();

    const container = await screen.findByTestId('response-option-table');
    const searchElement = container.querySelector('input');
    expect(searchElement).toBeInTheDocument;
    const tableBody = container.getElementsByTagName('tbody');
    expect(tableBody).toHaveLength(1);
    const tableList = tableBody[0].getElementsByTagName('tr');
    expect(tableList).toHaveLength(2);

    await userEvent.type(searchElement, 'second');
    await waitFor(() => {
      expect(tableList).toHaveLength(1);
    });
  });

  test("filter out only 'undefined' value from the table", async () => {
    renderWithProviders(
      <ReportTable
        responseType={ItemResponseType.Text}
        data-testid="response-option"
        answers={[
          {
            answer: {
              value: undefined,
              text: null,
            },
            date: '2024-01-09T14:13:42.400000',
          },
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-01-09T14:13:42.400000',
          },
        ]}
      />,
    );

    const container = await screen.findByTestId('response-option-table');
    const tableBody = container.getElementsByTagName('tbody');
    expect(tableBody).toHaveLength(1);
    const tableList = tableBody[0].getElementsByTagName('tr');
    expect(tableList).toHaveLength(1);
  });

  test('sort in the table', async () => {
    renderWithProviders(
      <ReportTable
        responseType={ItemResponseType.Text}
        data-testid="response-option"
        answers={answers}
      />,
    );

    const responseHeader = screen.getByText('Response');
    const container = await screen.findByTestId('response-option-table');
    const tableBody = container.getElementsByTagName('tbody');
    const tableList = tableBody[0].getElementsByTagName('tr');
    expect(tableList).toHaveLength(2);

    [...tableList].forEach((row, index) => {
      expect(row.textContent).toContain(ascSortedByResponse[index]);
    });

    // change sort
    await userEvent.click(responseHeader); // asc (default)
    await userEvent.click(responseHeader); // desc

    const descSortedByResponse = ascSortedByResponse.reverse();
    await waitFor(() => {
      [...tableList].forEach((row, index) => {
        expect(row.textContent).toContain(descSortedByResponse[index]);
      });
    });
  });
});
