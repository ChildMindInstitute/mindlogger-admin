import { DecryptedDrawingValue, ExportAnswer } from 'shared/types';

// Ex. appVersion = '1.0.4' ... '1.0.7'; appId: "mindlogger-mobile"
export const checkIf104_107MobileAppVersion = (client: ExportAnswer['client']) => {
  const appVersion = client?.app_version ?? '';
  const appId = client?.app_id ?? '';
  if (!appVersion || appId !== 'mindlogger-mobile') return false;

  const versionList = appVersion.split('.');
  if (!versionList[0] || !versionList[1] || !versionList[2]) return false;

  const major = Number(versionList[0]);
  const minor = Number(versionList[1]);
  const patch = Number(versionList[2]);

  return major === 1 && minor === 0 && patch >= 4 && patch <= 7;
};

export const getDrawingLines = (
  lines: DecryptedDrawingValue['lines'],
  width: DecryptedDrawingValue['width'],
  has104_107MobileAppVersion: boolean = false,
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
      const xCoordinate = has104_107MobileAppVersion ? point.x : (point.x / width) * 100;
      const yCoordinate = has104_107MobileAppVersion
        ? 100 - point.y
        : 100 - (point.y / width) * 100;

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
