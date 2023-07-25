export const enum MimeType {
  Csv = 'text/csv',
}

export const enum FileAcceptFormat {
  Csv = '.csv',
  Xlsx = '.xlsx',
  Xls = '.xls',
  Ods = '.ods',
}

export const PrimaryAcceptFormats = [
  FileAcceptFormat.Csv,
  FileAcceptFormat.Xlsx,
  FileAcceptFormat.Xls,
  FileAcceptFormat.Ods,
];

export const SecondaryAcceptFormats = [FileAcceptFormat.Csv, FileAcceptFormat.Xlsx];
