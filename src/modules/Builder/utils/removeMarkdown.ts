export const removeMarkdown = (text?: string) =>
  text
    ? text
        .replaceAll(/[#>|]/g, '')
        .replaceAll(/\*\*([\s\S]*?)\*\*/g, '$1')
        .replaceAll(/\*([\s\S]*?)\*/g, '$1')
        .replaceAll(/==([\s\S]*?)==/g, '$1')
        .replaceAll(/\+\+([\s\S]*?)\+\+/g, '$1')
        .replaceAll(/~~([\s\S]*?)~~/g, '$1')
        .replaceAll(/~([\s\S]*?)~/g, '$1')
        .replaceAll(/\^([\s\S]*?)\^/g, '$1')
        .replaceAll(/::: hljs-(center|left|right)([\s\S]*?):::/g, '$2')
    : '';
