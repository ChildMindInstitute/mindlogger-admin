import { DecryptedDrawingValue } from 'shared/types';

export const getDrawingLines = (
  lines: DecryptedDrawingValue['lines'],
  width: DecryptedDrawingValue['width'],
) => {
  if (!width) return [];

  const result = [];
  let startTime = 0,
    firstPoint = true;

  for (let i = 0; i < lines.length; i++) {
    for (const point of lines[i].points) {
      if (!startTime) {
        startTime = point.time;
      }

      result.push({
        line_number: i.toString(),
        x: ((point.x / width) * 100).toString(),
        y: (100 - (point.y / width) * 100).toString(),
        UTC_Timestamp: Number(point.time / 1000).toString(),
        seconds: Number((point.time - startTime) / 1000).toString(),
        epoch_time_in_seconds_start: firstPoint ? (startTime / 1000).toString() : '',
      });

      firstPoint = false;
    }
  }

  return result;
};
