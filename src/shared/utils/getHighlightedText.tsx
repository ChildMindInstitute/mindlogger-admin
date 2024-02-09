import { Box } from '@mui/material';

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getHighlightedText = (text: string, search: string) => {
  const searchPattern = new RegExp(escapeRegExp(search), 'gi');

  const highlightedTextHtml = search
    ? text.replace(searchPattern, (searchValue) => `<mark class="highlighted-text">${searchValue}</mark>`)
    : text;

  return <Box component="span" dangerouslySetInnerHTML={{ __html: highlightedTextHtml }} />;
};
