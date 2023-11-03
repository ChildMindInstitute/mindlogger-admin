export const getRespondentName = (secretId: string, nickname?: string | null) =>
  `${secretId}${nickname ? ` (${nickname})` : ''}`.trim();
