import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { write } from 'xlsx';

export function saveTranslationWorkbook(workbook, outputRoot) {
  const excel = write(workbook, { type: 'buffer', bookType: 'xlsx', compression: true });
  mkdirSync(outputRoot, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  // A new directory preserves reports that are already being reviewed.
  const directory = mkdtempSync(path.join(outputRoot, `report-${timestamp}-`));
  const output = path.join(directory, 'translations-report.xlsx');
  try {
    writeFileSync(output, excel);
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }

  return output;
}
