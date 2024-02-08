import { Trans } from 'react-i18next';

import i18n from 'i18n';

const { t } = i18n;

export const invalidFileFormatError = (
  <Trans i18nKey="flankerRound.invalidFileFormat">
    Invalid file format or empty file. Please upload a sequence table in one of the following formats:
    <strong> .csv</strong> or <strong>.xlsx.</strong>
  </Trans>
);

export const invalidFieldError = t('flankerRound.fileCannotBeUploaded');

export const uploadLabel = (
  <Trans i18nKey="flankerRound.uploadSequences">
    Please upload a sequence of stimulus image files for each block in one of the following formats:
    <strong> .csv, .xlsx</strong>
  </Trans>
);
