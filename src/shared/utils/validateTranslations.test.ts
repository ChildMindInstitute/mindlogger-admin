import { validateTranslations } from './validateTranslations';

describe('validateTranslations', () => {
  it('reports missing keys, including keys inside a missing nested section', () => {
    expect(
      validateTranslations({
        en: { login: 'Log in', recovery: { title: 'Recover account', back: 'Back' } },
        fr: { login: 'Se connecter' },
      }),
    ).toEqual([
      {
        type: 'missing-key',
        language: 'fr',
        key: 'recovery.title',
        englishValue: 'Recover account',
      },
      { type: 'missing-key', language: 'fr', key: 'recovery.back', englishValue: 'Back' },
    ]);
  });

  it.each(['', ' ', '\t\n', '\u00a0'])(
    'classifies blank text %j as empty rather than missing or identical',
    (value) => {
      expect(validateTranslations({ en: { save: 'Save' }, fr: { save: value } })).toEqual([
        { type: 'empty-value', language: 'fr', key: 'save', englishValue: 'Save' },
      ]);
    },
  );

  it('reports exact matches without normalizing case, whitespace, or interpolation', () => {
    expect(
      validateTranslations({
        en: {
          save: 'Save',
          back: 'Back',
          next: 'Next',
          greeting: 'Hello {{name}}',
          cancel: 'Cancel',
        },
        fr: {
          save: 'Save',
          back: 'back',
          next: 'Next ',
          greeting: 'Hello {{name}}',
          cancel: 'Annuler',
        },
      }),
    ).toEqual([
      { type: 'same-as-reference', language: 'fr', key: 'save', englishValue: 'Save' },
      {
        type: 'same-as-reference',
        language: 'fr',
        key: 'greeting',
        englishValue: 'Hello {{name}}',
      },
    ]);
  });

  it('compares plural keys individually for every non-English language', () => {
    expect(
      validateTranslations({
        en: { selection: { count_one: '{{count}} item', count_other: '{{count}} items' } },
        fr: { selection: { count_one: '{{count}} élément', count_many: '{{count}} éléments' } },
        es: { selection: { count_one: '{{count}} elemento', count_other: '{{count}} items' } },
      }),
    ).toEqual([
      {
        type: 'missing-key',
        language: 'fr',
        key: 'selection.count_other',
        englishValue: '{{count}} items',
      },
      {
        type: 'same-as-reference',
        language: 'es',
        key: 'selection.count_other',
        englishValue: '{{count}} items',
      },
    ]);
  });

  it.each([null, 0, false, [], {}])('reports non-string translations %j as missing', (value) => {
    expect(validateTranslations({ en: { save: 'Save' }, fr: { save: value } })).toEqual([
      { type: 'missing-key', language: 'fr', key: 'save', englishValue: 'Save' },
    ]);
  });

  it('does not report English, extra target keys, or non-string English values', () => {
    expect(
      validateTranslations({
        en: { save: 'Save', metadata: null, version: 1, enabled: true, list: ['One'] },
        fr: { save: 'Enregistrer', extra: 'Extra' },
      }),
    ).toEqual([]);
  });

  it('classifies two empty strings as empty rather than identical', () => {
    expect(validateTranslations({ en: { save: '' }, fr: { save: '' } })).toEqual([
      { type: 'empty-value', language: 'fr', key: 'save', englishValue: '' },
    ]);
  });

  it('rejects a missing English reference instead of silently reporting no findings', () => {
    expect(() => validateTranslations({ fr: { save: 'Enregistrer' } })).toThrow(
      'English translations are required for comparison.',
    );
  });
});
