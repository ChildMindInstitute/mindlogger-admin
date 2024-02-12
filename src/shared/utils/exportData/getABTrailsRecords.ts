import { DecryptedABTrailsValue } from 'shared/types';

export const getABTrailsRecords = (
  lines: DecryptedABTrailsValue['lines'],
  width: DecryptedABTrailsValue['width'],
) => {
  if (!width) return [];

  const result = [];
  let totalTime = 0,
    errorCount = 0,
    startTime = 0,
    firstPoint = true;

  for (let index = 0; index < lines.length; index++) {
    let hasError = false;
    for (const point of lines[index].points) {
      if (!point.valid) {
        hasError = true;
      }

      if (!startTime) {
        startTime = point.time;
      }

      result.push({
        line_number: index.toString(),
        x: ((point.x / width) * 100).toString(),
        y: (100 - (point.y / width) * 100).toString(),
        // eslint-disable-next-line no-nested-ternary
        error: point.valid ? 'E0' : point.actual !== 'none' ? 'E1' : 'E2',
        correct_path: `${point.start} ~ ${point.end}`,
        actual_path: `${point.start} ~ ${
          point.actual === 'none' ? '?' : point.actual || point.end
        }`,
        UTC_Timestamp: Number(point.time / 1000).toString(),
        seconds: Number((point.time - startTime) / 1000).toString(),
        epoch_time_in_seconds_start: firstPoint ? (startTime / 1000).toString() : '',
        total_time: '',
        total_number_of_errors: '',
      });

      firstPoint = false;

      if (totalTime < point.time - startTime) {
        totalTime = point.time - startTime;
      }
    }

    if (hasError) {
      errorCount++;
    }
  }

  if (result.length) {
    result[0].total_time = Number(totalTime / 1000).toString();
    result[0].total_number_of_errors = String(errorCount);
  }

  return result;
};
