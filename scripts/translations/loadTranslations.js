import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export function loadTranslations(directory) {
  const readTranslation = (file) => {
    const translations = JSON.parse(readFileSync(path.join(directory, file), 'utf8'));
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      throw new Error(`${file} must contain a translation object.`);
    }

    return translations;
  };
  const targets = readdirSync(directory)
    .filter((file) => /^app-.+\.json$/.test(file) && file !== 'app-en.json')
    .sort()
    .map((file) => ({
      file,
      language: file.slice('app-'.length, -'.json'.length),
      translations: readTranslation(file),
    }));
  const resources = {
    en: readTranslation('app-en.json'),
    ...Object.fromEntries(targets.map(({ language, translations }) => [language, translations])),
  };

  return { targets, resources };
}
