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
    submitBtnColor: type === 'default' ? 'error' : 'primary',
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

export const timeValidationRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const notificationValidationRegex = /^([01]\d|2[0-3]):([0-5]\d)|(-)$/;

export const frequencyArray = ['Always', 'Once', 'Daily', 'Weekly', 'Monthly', 'Weekdays'];
