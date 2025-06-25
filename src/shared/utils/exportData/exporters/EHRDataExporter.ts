import { BASE_API_URL } from 'api';
import { authStorage } from 'shared/utils/authStorage';
import { DataExporterOptions } from 'shared/utils/exportData/exporters/DataExporter';

type EHRDataExporterOptions = DataExporterOptions & {
  /**
   * Restrict the exported data to those users with the given subject IDs.
   * If provided together with `respondentIds`, the result will be the intersection of the two.
   */
  subjectIds?: string[];

  /**
   * Restrict the exported data to those users with these IDs.
   * If provided together with `subjectIds`, the result will be the intersection of the two.
   */
  respondentIds?: string[];

  /**
   * Restrict the exported data to those activities with the given IDs
   */
  activityIds?: string[];

  /**
   * Restrict the exported data to those activity flows with the given IDs
   */
  flowIds?: string[];
};

/**
 * A helper class for retrieving the EHR data export for a given applet, optionally constrained by
 * a date range, subject IDs, respondent IDs, and/or activity/flow IDs.
 */
export class EHRDataExporter {
  async exportData({
    appletId,
    fromDate,
    toDate,
    activityIds,
    flowIds,
    respondentIds,
    subjectIds,
  }: EHRDataExporterOptions): Promise<{ size?: number }> {
    // Build the URL with query parameters
    const queryParams = new URLSearchParams();
    if (fromDate) queryParams.append('fromDate', fromDate);
    if (toDate) queryParams.append('toDate', toDate);
    activityIds?.forEach((id) => queryParams.append('activityIds', id));
    flowIds?.forEach((id) => queryParams.append('flowIds', id));
    respondentIds?.forEach((id) => queryParams.append('respondentIds', id));
    subjectIds?.forEach((id) => queryParams.append('targetSubjectIds', id));

    const queryString = queryParams.toString();

    const url = `${BASE_API_URL}/answers/applet/${appletId}/ehr-data?${queryString}`;

    // We need to process the response manually rather than using a simple redirect
    // because this request requires authentication via the Authorization header.
    // A direct browser navigation approach (window.location.href) wouldn't include our
    // auth token. Instead, we fetch the data with proper headers, then create a temporary
    // downloadable object in the browser's memory that the user can access.
    // This approach satisfies auth requirements while still allowing the user to download
    // the exported data seamlessly.

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStorage.getAccessToken()}`,
      },
    });

    // Handle errors
    if (!response.ok) throw new Error(`EHR data download failed for ${url}`);

    // No EHR data matching the query parameters found
    if (response.status === 204) return {};

    // Get the filename from the Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'EHR.zip';

    // Create a download link and trigger it
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);

    return { size: blob.size };
  }
}
