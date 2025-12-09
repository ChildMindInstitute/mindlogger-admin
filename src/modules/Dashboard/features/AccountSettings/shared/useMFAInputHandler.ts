export const useMFAInputHandler = (
  setVerificationCode: (code: string) => void,
  clearError: () => void,
  error: string | null,
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
      if (error) {
        clearError();
      }
    }
  };

  return { handleInputChange };
};
