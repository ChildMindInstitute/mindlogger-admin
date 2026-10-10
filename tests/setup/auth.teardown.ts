import {test as teardown} from '@playwright/test';
import fs from "fs";
import {runtimeConfig} from "../config";

teardown('deauthenticate', async () => {
    // Delete the session file if it exists
    [runtimeConfig.adminTokenFile, runtimeConfig.userTokenFile].forEach(it => {
        if (fs.existsSync(it)) {
          fs.unlinkSync(it);
            console.log(`Deleted session file: ${it}`);
        } else {
            console.log(`Session file not found at: ${it}`);
        }
    });

});
