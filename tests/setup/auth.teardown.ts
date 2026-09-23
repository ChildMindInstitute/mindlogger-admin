import {test as teardown} from "playwright/types/test";
import fs from "fs";
import {runtimeConfig} from "../config";

teardown('deauthenticate', async () => {
    // const sessionFilePath = path.join('tests/', '.auth/session.json');
    // Delete the session file if it exists
    if (fs.existsSync(runtimeConfig.storageState)) {
    fs.unlinkSync(runtimeConfig.storageState);
    console.log(`Deleted session file: ${runtimeConfig.storageState}`);
    } else {
    console.log(`Session file not found at: ${runtimeConfig.storageState}`);
    }
});
