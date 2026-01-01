import { mfaApi } from 'shared/api';
import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

import { extractFilenameFromHeader, generateTimestampedFilename } from './fileDownload.utils';

export const useRecoveryCodesDownload = (
  recoveryCodes: (string | RecoveryCodeItem)[],
  downloadToken?: string,
) => {
  const downloadFromBackend = async () => {
    if (!downloadToken) {
      throw new Error('Download token is required for backend download');
    }

    const response = await mfaApi.downloadRecoveryCodes(downloadToken);

    const blob = new Blob([response.data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Extract filename from Content-Disposition header or use timestamped default
    const contentDisposition =
      response.headers['content-disposition'] || response.headers['Content-Disposition'];
    const filename = extractFilenameFromHeader(contentDisposition) || generateTimestampedFilename();

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Append to drawer to prevent ClickAwayListener from closing modals
    const drawer = document.querySelector('[data-testid="account-panel"]');
    const targetElement = drawer || document.body;

    targetElement.appendChild(link);
    link.click();
    targetElement.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    // Require downloadToken (5-min JWT) for security - no frontend fallback
    if (!downloadToken) {
      throw new Error('Download token is required. Cannot download recovery codes.');
    }

    await downloadFromBackend();
  };

  return { handleDownload };
};
