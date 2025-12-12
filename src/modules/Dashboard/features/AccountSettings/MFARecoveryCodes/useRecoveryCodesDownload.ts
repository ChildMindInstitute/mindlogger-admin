import { mfaApi } from 'shared/api';
import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

import { getCodeString } from './MFARecoveryCodes.utils';

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

    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : 'recovery_codes.txt';

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
    link.download = 'mfa-recovery-codes.txt';
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
