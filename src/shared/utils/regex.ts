/**
 * Generate a case-insensitive regular expression that will match any of the strings in the provided list.
 * @param strings A list of strings to match
 */
export const createRegexFromList = (strings: string[]): RegExp => {
  if (strings.length === 0) {
    return new RegExp('a^');
  }

  // Escape any special characters in each string
  const escapedStrings = strings.map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // Join the escaped strings with the pipe symbol (|)
  const regexPattern = escapedStrings.join('|');

  // Create a case-insensitive regex
  return new RegExp(`^(${regexPattern})$`, 'i');
};
