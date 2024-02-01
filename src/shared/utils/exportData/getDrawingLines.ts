import { DecryptedDrawingValue, ExportAnswer } from 'shared/types';

// Ex. appVersion = '1.0.4' ... '1.0.7'; appId: "mindlogger-mobile"
export const checkIfShouldScaleCoords = (client: ExportAnswer['client']) => {
  const appVersion = client?.app_version ?? '';
  const appId = client?.app_id ?? '';
  if (!appVersion || appId !== 'mindlogger-mobile') return false;

  const [major, minor, patch] = appVersion.split('.');
  if (!major || !minor || !patch) return false;

  const majorNumber = Number(major);
  const minorNumber = Number(minor);
  const patchNumber = Number(patch);

  return majorNumber === 1 && minorNumber === 0 && patchNumber >= 4 && patchNumber <= 7;
};

export const getDrawingLines = (
  lines: DecryptedDrawingValue['lines'],
  width: DecryptedDrawingValue['width'],
  shouldScaleCoords: boolean = false,
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
      const xCoordinate = shouldScaleCoords ? point.x : (point.x / width) * 100;
      const yCoordinate = shouldScaleCoords ? 100 - point.y : 100 - (point.y / width) * 100;

      result.push({
        line_number: i.toString(),
        x: xCoordinate.toString(),
        y: yCoordinate.toString(),
        UTC_Timestamp: Number(point.time / 1000).toString(),
        seconds: Number((point.time - startTime) / 1000).toString(),
        epoch_time_in_seconds_start: firstPoint ? (startTime / 1000).toString() : '',
      });

      firstPoint = false;
    }
  }

  return result;
};
