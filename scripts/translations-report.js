/* eslint-disable no-console -- This developer command prints its report to the terminal. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Node 24 (the project's required version) can load this TypeScript helper directly.
import { validateTranslations } from '../src/shared/utils/validateTranslations.ts';

const reports = {
  missing: { type: 'missing-key', label: 'MISSING', description: 'missing' },
  empty: { type: 'empty-value', label: 'EMPTY', description: 'empty' },
  same: {
    type: 'same-as-reference',
    label: 'SAME AS ENGLISH',
    description: 'same as English',
  },
};

function reportTranslations() {
  const [category, ...extraArgs] = process.argv.slice(2);
  if (!Object.hasOwn(reports, category) || extraArgs.length > 0) {
    throw new Error('Usage: node scripts/translations-report.js <missing|empty|same>');
  }

  const report = reports[category];
  const directory = fileURLToPath(new URL('../src/resources/', import.meta.url));
  const files = readdirSync(directory)
    .filter((file) => /^app-.+\.json$/.test(file) && file !== 'app-en.json')
    .sort();
  const readTranslation = (file) => {
    const translations = JSON.parse(readFileSync(path.join(directory, file), 'utf8'));
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      throw new Error(`${file} must contain a translation object.`);
    }

    return translations;
  };
  const languageFromFile = (file) => file.slice('app-'.length, -'.json'.length);
  const resources = {
    en: readTranslation('app-en.json'),
    ...Object.fromEntries(files.map((file) => [languageFromFile(file), readTranslation(file)])),
  };
  const findings = validateTranslations(resources).filter(
    (finding) => finding.type === report.type,
  );
  const summaries = [];

  console.log(`Comparing ${files.length} languages against app-en.json\n`);
  console.log(`Showing ${report.description} translations only.\n`);
  if (category === 'same') {
    console.log(
      'Identical text may be intentional (for example, language names); review each match.\n',
    );
  }

  for (const file of files) {
    const language = languageFromFile(file);
    const current = findings.filter((finding) => finding.language === language);
    console.log(`${language} (${file})`);

    for (const finding of current) {
      console.log(`  ${report.label}  ${finding.key}`);
      console.log(`    English: ${JSON.stringify(finding.englishValue)}`);
    }

    const summary = `${language}: ${current.length} ${report.description}`;
    summaries.push(summary);
    console.log(`  ${summary}\n`);
  }

  console.log('Summary');
  for (const summary of summaries) console.log(`  ${summary}`);
  console.log(`\n${findings.length} findings. No translation files were changed.`);
}

try {
  reportTranslations();
} catch (error) {
  console.error(`Unable to check translations: ${error.message}`);
  process.exitCode = 1;
}
