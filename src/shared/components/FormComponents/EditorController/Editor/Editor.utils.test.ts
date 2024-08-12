import { fixAngleBrackets } from './Editor.utils';

describe('fixAngleBrackets', () => {
  test.each([
    { input: 'This is &lt;ab test&gt;', output: 'This is <ab test>' },
    {
      input: 'Some text &lt;with&gt; mixed content &lt;and&gt; symbols',
      output: 'Some text <with> mixed content <and> symbols',
    },
    {
      input: 'This is a test with no encoded brackets',
      output: 'This is a test with no encoded brackets',
    },
    { input: '', output: '' },
    { input: '&lt;', output: '<' },
    { input: '&gt;', output: '>' },
    { input: 'This &lt;&lt; is &gt; a &gt; test', output: 'This << is > a > test' },
  ])('should correctly replace encoded angle brackets in "$input"', ({ input, output }) => {
    expect(fixAngleBrackets(input)).toBe(output);
  });
});
