import { Trans, useTranslation } from 'react-i18next';

import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_25MB, MediaType, UploadFileError } from 'shared/consts';

import { Banner, BannerProps } from '../Banner';
import { formatError } from './IncorrectFileBanner.const';

export const IncorrectFileBanner = ({ errorType, fileType, ...props }: BannerProps) => {
  const { t } = useTranslation('app');

  const isFormatError = errorType === UploadFileError.Format;

  return (
    <Banner severity="error" {...props}>
      {isFormatError ? (
        t(formatError[fileType as MediaType])
      ) : (
        <Trans i18nKey="incorrectImageSize">
          Image is more than <>{{ size: byteFormatter(MAX_FILE_SIZE_25MB) }}</>.
        </Trans>
      )}
    </Banner>
  );
};
