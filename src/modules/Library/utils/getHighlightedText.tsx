import Highlighter from 'react-highlight-words';

export const getHighlightedText = (searchTerm: string, text: string) => {
  if (!searchTerm) return text;

  return (
    <Highlighter
      highlightClassName="marked"
      searchWords={[searchTerm]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
};
