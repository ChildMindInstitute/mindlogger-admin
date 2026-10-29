import {request, test as base} from '@playwright/test';
import {UserAPI} from "../utils/api-client/user-api";
import {AppletAPI} from "../utils/api-client/applet-api";
import {runtimeConfig} from "../config";
import {readStorageFile} from "../utils/file";

type Fixtures = {
  userApi: UserAPI;
  adminUserApi: UserAPI
  appletApi: AppletAPI
  adminAppletApi: AppletAPI
};


const initContext = async (storageFile: string) => {
  const { accessToken } = JSON.parse(
    readStorageFile(storageFile)
  );

  return await request.newContext({
    baseURL: runtimeConfig.apiBaseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}

export const test = base.extend<Fixtures>({
  userApi: async ({}: any, use) => {
    const context = await initContext(runtimeConfig.userTokenFile)

    const api = new UserAPI(context);
    await use(api);
    await api.dispose();
  },

  adminUserApi: async ({}: any, use) => {
    const context = await initContext(runtimeConfig.adminTokenFile)

    const api = new UserAPI(context);
    await use(api);
    await api.dispose();
  },


  appletApi: async ({}: any, use) => {
    const context = await initContext(runtimeConfig.userTokenFile)

    const api = new AppletAPI(context);
    await use(api);
    await api.dispose();
  },

  adminAppletApi: async ({}: any, use) => {
    const context = await initContext(runtimeConfig.adminTokenFile)

    const api = new AppletAPI(context);
    await use(api);
    await api.dispose();
  }

});


export { expect } from '@playwright/test';
