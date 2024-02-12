import { ElementType } from 'react';
import { Trans } from 'react-i18next';

export const getScreens = (
  type: 'individual' | 'default',
  components: Record<'individual' | 'default', JSX.Element[]>,
) => [
  {
    component: components[type][0],
    btnText: 'continue',
    hasSecondBtn: true,
    secondBtnText: 'cancel',
    submitBtnColor: type === 'default' ? 'error' : 'primary',
  },
  { component: components[type][1], btnText: 'import', hasSecondBtn: false },
  {
    component: components[type][2],
    btnText: 'updateSchedule',
    hasSecondBtn: true,
    secondBtnText: 'cancel',
    submitBtnColor: 'error',
  },
];

export const invalidFileFormatError = (
  <Trans i18nKey="invalidFileFormat">
    Invalid file format. Please upload a schedule table in one of the following formats:
    <strong> .csv, .xls, .xlsx, .ods.</strong>
  </Trans>
);

export const uploadLabel = (
  <Trans i18nKey="uploadSchedule">
    Please upload a schedule in one of the following formats:
    <strong> .csv, .xls, .xlsx, .ods. </strong>
  </Trans>
);

export const timeValidationRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
export const notificationValidationRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])|(-)$/;

const dayValidation = '(?:0?[1-9]|[12][0-9]|3[01])';
const monthValidation =
  '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const yearValidation = '(?:\\d{2}|\\d{4})';

export const dateValidationRegex = new RegExp(
  `^${dayValidation}([- ])?${monthValidation}\\1${yearValidation}$`,
);

export const frequencyArray = ['Always', 'Once', 'Daily', 'Weekly', 'Monthly', 'Weekdays'];
export const EMPTY_TIME = '-';
export const ALWAYS_FREQUENCY = 'Always';

export const commonErrorBoxProps = { component: 'span' as ElementType, sx: { display: 'block' } };
