
export interface UserData {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export function generateRandomUser(password?: string): UserData {
  const uid = crypto.randomUUID();

  return {
    email: `user-${uid}@example.com`,
    firstName: 'Test',
    lastName: `User ${uid}`,
    password: password || 'DefaultPassword123!',
  };
}

export function generateUniqueEmail(baseEmail?: string): string {
  if (baseEmail && baseEmail.includes('@')) {
    const [local, domain] = baseEmail.split('@');
    return `${local}${Date.now()}@${domain}`;
  }

  return `user${Date.now()}@example.com`;
}
