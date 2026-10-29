import {CuriousApi} from "./api";

interface CreateUserPayload {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface CreateUserResponse {
  result: {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
  };
}

export class UserAPI extends CuriousApi {

  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    try {
      this.log(`Creating user: ${payload.email}`);
      const response = await this.apiContext.post('/users', { data: payload });

      if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${response.status()} ${response.statusText()} - ${errorText}`);
      }
      // The response object is from Playwright’s APIRequestContext.post() call.
      // const result: CreateUserResponse This ensures type safety: if the API response doesn’t match this structure, TypeScript will warn you during development.
      const result: CreateUserResponse = await response.json();
      this.log(`User created successfully: ${result.result.email} (ID: ${result.result.id})`);
      return result;
    } catch (error) {
      this.log(`Error creating user: ${error}`);
      throw error;
    }
  }

  async login(email: string, password: string, retries = 3, delayMs = 1000) {
    this.log(`Attempting login for ${email} with ${retries} retries`);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.apiContext.post('/auth/login', {
          data: { email, password }
        });

        if (!response.ok()) {
          const errorText = await response.text();
          throw new Error(`Login failed: ${response.status()} ${response.statusText()} - ${errorText}`);
        }

        const result = await response.json();
        this.log(`Login successful for ${email}`);
        return result;
      } catch (error) {
        this.log(`Login attempt ${attempt} failed: ${error}`);
        if (attempt < retries) {
          this.log(`Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          this.log(`All login attempts failed for ${email}`);
          throw error;
        }
      }
    }
  }

  async dispose() {
    try {
      await this.apiContext.dispose();
      this.log('API context disposed');
    } catch (error) {
      this.log(`Error disposing API context: ${error}`);
    }
  }

  private log(message: string) {
    console.log(`[UserAPI] ${new Date().toISOString()} - ${message}`);
  }
}
