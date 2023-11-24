import JSZip from 'jszip';

import { getUploadFormData } from 'shared/utils/getUploadFormData';

import { BLOB_ZIP_OPTIONS } from './exportData/exportZip';
import { postLogFile } from '../api/api';

const DEVICE_ID = 'browser';

export const getOS = () => {
  let osName = 'unknown';
  let osFormerName = 'unknown';
  if (navigator.userAgent.indexOf('Win') !== -1) osName = 'Windows';
  if (navigator.userAgent.indexOf('Mac') !== -1) osName = 'Macintosh';
  if (navigator.userAgent.indexOf('Linux') !== -1) osName = 'Linux';
  if (navigator.userAgent.indexOf('Android') !== -1) osName = 'Android';
  if (navigator.userAgent.indexOf('like Mac') !== -1) osName = 'iOS';

  if (navigator.appVersion.indexOf('Win') !== -1) osFormerName = 'Windows';
  if (navigator.appVersion.indexOf('Mac') !== -1) osFormerName = 'MacOS';
  if (navigator.appVersion.indexOf('X11') !== -1) osFormerName = 'UNIX';
  if (navigator.appVersion.indexOf('Linux') !== -1) osFormerName = 'Linux';

  return `${osName}/${osFormerName}`;
};

export const sendLogFile = async ({
  error,
  formData,
}: {
  error: TypeError;
  formData?: Record<string, unknown>;
}) => {
  if (process.env.NODE_ENV !== 'production') return;

  const { platform, appVersion, appName, userAgent, hardwareConcurrency, language } = navigator;
  const time = new Date().getTime();
  const { href } = location;
  const urlObject = new URL(href);
  const { pathname } = urlObject;
  const logObject = {
    time,
    details: {
      os: getOS(),
      platform,
      appVersion,
      appName,
      userAgent,
      hardwareConcurrency,
      language,
    },
    href: location.href,
    formData: formData ?? '',
    errorMessage: error?.message ?? '',
    errorStack: error?.stack ?? '',
  };
  const logString = JSON.stringify(logObject, undefined, 4);
  const file = new File([logString], `log_${time}.txt`, {
    type: 'text/plain',
    lastModified: time,
  });
  const fileId = `${pathname.replace(/\//g, '_')}_${time}`;
  const zip = new JSZip();
  zip.file(`${fileId}.txt`, file);
  const content = await zip.generateAsync(BLOB_ZIP_OPTIONS);
  const fileFormData = getUploadFormData(content);

  try {
    const result = await postLogFile({
      deviceId: DEVICE_ID,
      fileId: `${fileId}.zip`,
      file: fileFormData,
    });
    console.warn('[LOGGER]', result);
  } catch (error) {
    console.warn('Error while file logging:', error);
  }
};
