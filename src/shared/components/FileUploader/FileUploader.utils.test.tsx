import { File as NodeFile } from 'node:buffer';

import { importTable } from './FileUploader.utils';

const columns = ['activityName', 'date', 'startTime', 'endTime', 'notificationTime', 'frequency'];
const times = '10:00;11:00;12:00;13:00;14:00;15:00;16:00;17:00';

// jsdom's File can't be read by Response, so use Node's
const getCsvFile = (lines: string[]) =>
  new NodeFile([lines.join('\n')], 'schedule.csv', { type: 'text/csv' }) as unknown as File;

describe('importTable', () => {
  test('keeps comma columns when cells hold many ; separated values', async () => {
    const rows = Array.from(
      { length: 30 },
      (_, i) => `Activity ${i},06 Nov 2026,10:00,18:00,${times},Daily`,
    );

    const [firstRow] = await importTable(getCsvFile([columns.join(','), ...rows]), true);

    expect(Object.keys(firstRow)).toEqual(columns);
    expect(firstRow.notificationTime).toBe(times);
  });

  test('still reads files that use ; as the column separator', async () => {
    const file = getCsvFile([
      columns.join(';'),
      'Activity 1;06 Nov 2026;10:00;18:00;"10:00;11:00";Daily',
    ]);

    const [firstRow] = await importTable(file, true);

    expect(Object.keys(firstRow)).toEqual(columns);
    expect(firstRow.notificationTime).toBe('10:00;11:00');
  });
});
