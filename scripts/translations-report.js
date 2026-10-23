/* eslint-disable no-console -- This developer command prints the export location and totals. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Node 24 (the project's required version) can load this TypeScript helper directly.
import { validateTranslations } from '../src/shared/utils/validateTranslations.ts';
import { loadTranslations } from './translations/loadTranslations.js';
import { createTranslationWorkbook } from './translations/createTranslationWorkbook.js';
import { saveTranslationWorkbook } from './translations/saveTranslationWorkbook.js';

function reportTranslations() {
  if (process.argv.length !== 2) {
    throw new Error('Usage: yarn translations:report');
  }

  const root = fileURLToPath(new URL('../', import.meta.url));
  const { targets, resources } = loadTranslations(path.join(root, 'src/resources'));
  const findings = validateTranslations(resources);
  const { workbook, summary } = createTranslationWorkbook(targets, findings);
  const output = saveTranslationWorkbook(workbook, path.join(root, 'translation-reports'));

  for (const { language, missing, empty, same } of summary) {
    console.log(`${language}: ${missing} missing, ${empty} empty, ${same} same as English`);
  }
  console.log(`\nReport: ${output}`);
  console.log('Source translation files were not changed.');
}

try {
  reportTranslations();
} catch (error) {
  console.error(`Unable to generate translation report: ${error.message}`);
  process.exitCode = 1;
}
