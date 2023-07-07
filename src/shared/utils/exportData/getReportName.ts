export const enum ZipFile {
  Media = 'media-responses',
  Drawing = 'drawing-responses',
}

export const getReportName = (name: ZipFile) => `${name}-${new Date().toDateString()}.zip`;
