export const getRespondentName = (
  secretId: string,
  nickname?: string | null,
  variant: 'default' | 'comma' = 'default',
) => {
  const secretIdString = secretId.trim();
  let nicknameString = '';
  if (nickname) {
    if (variant === 'comma') {
      nicknameString = secretIdString ? `, ${nickname}` : nickname;
    } else {
      nicknameString = ` (${nickname})`;
    }
  }

  return `${secretId}${nicknameString}`.trim();
};
