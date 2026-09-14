import { getTokenExpiration, parseJwtClaims } from './jwt';

const toBase64Url = (payload: object) =>
  btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const createToken = (payload: object) => `header.${toBase64Url(payload)}.signature`;

describe('parseJwtClaims', () => {
  test('returns every claim in the payload', () => {
    const token = createToken({ sub: 'user-1', family: 'fam-1', exp: 1893456000 });

    expect(parseJwtClaims(token)).toEqual({ sub: 'user-1', family: 'fam-1', exp: 1893456000 });
  });

  test('decodes payloads containing base64url-specific characters', () => {
    const token = createToken({ sub: 'a?b>c~d', exp: 1 });

    expect(parseJwtClaims(token)).toEqual({ sub: 'a?b>c~d', exp: 1 });
  });

  test.each([
    ['null', null],
    ['undefined', undefined],
    ['an empty string', ''],
    ['a string with no dots', 'not-a-jwt'],
    ['a token with an empty payload', 'header..signature'],
    ['a token with a non-base64 payload', 'header.@@@.signature'],
    ['a payload that is not JSON', `header.${btoa('plain text')}.signature`],
    ['a payload that is not an object', `header.${btoa('42')}.signature`],
  ])('returns null for %s', (_label, token) => {
    expect(parseJwtClaims(token)).toBeNull();
  });
});

describe('getTokenExpiration', () => {
  test('converts the exp claim from seconds to milliseconds', () => {
    expect(getTokenExpiration(createToken({ exp: 1893456000 }))).toBe(1893456000000);
  });

  test('is comparable against Date.now()', () => {
    const in15Minutes = Math.floor((Date.now() + 900000) / 1000);
    const expiresAt = getTokenExpiration(createToken({ exp: in15Minutes })) ?? 0;

    expect(expiresAt - Date.now()).toBeGreaterThan(890000);
  });

  test('returns null when the token has no exp claim', () => {
    expect(getTokenExpiration(createToken({ sub: 'user-1' }))).toBeNull();
  });

  test.each([
    ['a string', '1893456000'],
    ['null', null],
    ['a boolean', true],
  ])('returns null when exp is %s', (_label, exp) => {
    expect(getTokenExpiration(createToken({ exp }))).toBeNull();
  });

  test('returns null for a malformed token', () => {
    expect(getTokenExpiration('not-a-jwt')).toBeNull();
  });
});
