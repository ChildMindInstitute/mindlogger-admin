type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type TranslationFinding = {
  type: 'missing-key' | 'empty-value' | 'same-as-reference';
  language: string;
  key: string;
  englishValue: string;
};

const flattenStrings = (value: JsonValue, prefix = '', strings = new Map<string, string>()) => {
  if (typeof value === 'string') {
    strings.set(prefix, value);
  } else if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flattenStrings(child, prefix ? `${prefix}.${key}` : key, strings);
    }
  }

  return strings;
};

// Compare raw files so the app's English fallback cannot hide missing translations.
export const validateTranslations = (
  resources: Record<string, JsonValue>,
): TranslationFinding[] => {
  if (!Object.prototype.hasOwnProperty.call(resources, 'en')) {
    throw new Error('English translations are required for comparison.');
  }

  const english = flattenStrings(resources.en);
  const findings: TranslationFinding[] = [];

  for (const [language, tree] of Object.entries(resources)) {
    if (language === 'en') continue;

    const translations = flattenStrings(tree);

    for (const [key, englishValue] of english) {
      const value = translations.get(key);
      let type: TranslationFinding['type'] | undefined;

      // Non-string values also mean no usable string translation exists.
      if (value === undefined) {
        type = 'missing-key';
      } else if (value.trim() === '') {
        type = 'empty-value';
      } else if (value === englishValue) {
        type = 'same-as-reference';
      }

      if (type) findings.push({ type, language, key, englishValue });
    }
  }

  return findings;
};
