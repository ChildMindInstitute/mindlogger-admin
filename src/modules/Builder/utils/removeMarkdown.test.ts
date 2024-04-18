import { removeMarkdown } from './removeMarkdown';

describe('removeMarkdown', () => {
  test.each`
    markdownString                           | expected                        | description
    ${'# Heading'}                           | ${' Heading'}                   | ${'removes hashtags'}
    ${'> Blockquote'}                        | ${' Blockquote'}                | ${'removes blockquotes'}
    ${'| Vertical bar'}                      | ${' Vertical bar'}              | ${'removes vertical bar'}
    ${'**Bold text**'}                       | ${'Bold text'}                  | ${'removes double asterisks (bold)'}
    ${'*Italic text*'}                       | ${'Italic text'}                | ${'removes single asterisks (italic)'}
    ${'==Marked text=='}                     | ${'Marked text'}                | ${'removes double equals signs (marked)'}
    ${'++Inserted text++'}                   | ${'Inserted text'}              | ${'removes double plus signs (inserted)'}
    ${'~~Strikethrough text~~'}              | ${'Strikethrough text'}         | ${'removes double tilde signs (strikethrough)'}
    ${'~Code text~'}                         | ${'Code text'}                  | ${'removes single tilde signs (code)'}
    ${'^Superscript text^'}                  | ${'Superscript text'}           | ${'removes caret signs (superscript)'}
    ${'::: hljs-centerCentered text:::'}     | ${'Centered text'}              | ${'removes hljs-center code blocks'}
    ${'::: hljs-leftLeft-aligned text:::'}   | ${'Left-aligned text'}          | ${'removes hljs-left code blocks'}
    ${'::: hljs-rightRight-aligned text:::'} | ${'Right-aligned text'}         | ${'removes hljs-right code blocks'}
    ${'# Title**Bold text**> Blockquote'}    | ${' TitleBold text Blockquote'} | ${'removes multiple Markdown elements in a single text'}
    ${undefined}                             | ${''}                           | ${'handles undefined markdown string'}
    ${''}                                    | ${''}                           | ${'handles empty markdown string'}
  `('$description', ({ markdownString, expected }) => {
    expect(removeMarkdown(markdownString)).toEqual(expected);
  });
});
