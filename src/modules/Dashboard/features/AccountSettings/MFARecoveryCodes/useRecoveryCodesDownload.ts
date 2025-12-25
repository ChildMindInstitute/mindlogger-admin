import { mfaApi } from 'shared/api';
import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

import { getCodeString } from './MFARecoveryCodes.utils';
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

    // Create blob from response data
    const blob = new Blob([response.data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition header or generate timestamped filename
    const contentDisposition =
      response.headers['content-disposition'] || response.headers['Content-Disposition'];
    const filename = extractFilenameFromHeader(contentDisposition) || generateTimestampedFilename();

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadFromFrontend = () => {
    // Convert codes to strings (handles both string[] and RecoveryCodeItem[])
    const codeStrings = recoveryCodes.map((code) => getCodeString(code));
    const codesText = codeStrings.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Always use timestamped filename for consistency
    link.download = generateTimestampedFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    // If downloadToken is available (viewing scenario), use backend endpoint
    if (downloadToken) {
      try {
        await downloadFromBackend();
      } catch (error) {
        console.error('Failed to download recovery codes from backend:', error);
        // Fallback to frontend download if backend fails
        downloadFromFrontend();
      }
    } else {
      // No token (setup scenario), create file on frontend
      downloadFromFrontend();
    }
  };

  return { handleDownload };
};
