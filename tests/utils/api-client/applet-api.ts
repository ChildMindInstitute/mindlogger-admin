// TODO Perhaps a better implementation
import { expect } from '@playwright/test';
import {CuriousApi} from "./api";

// Important: make sure we authenticate in a clean environment by unsetting storage state.
// ensure admimin login via API and return token

interface createAppletPayload {
    displayName: string;
    description: object;
    themeId: string;
    about: object;
    image: string;
    watermark: string;
    activities: object[];
    activityFlows: object[];
    reportEmailBody: string;
    streamIpAddress: string | null;
    streamPort: number | null;
    encryption: object;
}

export class AppletAPI extends CuriousApi {

    async createApplet(appletData: createAppletPayload): Promise<any> {
        const response = await this.apiContext.post('/applets', { data: appletData });
        console.log(response);
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }

    async createManagerInvite(inviteData: { email: string; firstName: string; lastName: string; language: string; role: string; workspacePrefix: string; title: string; }, appletID: string): Promise<any> {
        const response = await this.apiContext.post(`/invitations/${appletID}/managers`, { data: inviteData });
        console.log(response);
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }

    async getAppletInvitations(appletID: string): Promise<any> {
        const response = await this.apiContext.get(`/invitations?page=1&limit=10&ordering=-id&appletId=${appletID}`);
        console.log(response);
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }

    // async ensureAdminApiLogin(_request: APIRequestContext, page: Page): Promise<string> {
    //   const email = process.env.uat.PLAYWRIGHT_ADMIN_EMAIL || '';
    //   const password = process.env.uat.PLAYWRIGHT_ADMIN_PASSWORD || '';
    //
    //   // Perform API login to get the token
    //   const token = await apiAdminLogin(page, email, password);
    //   return token;
    // }

// Decide if Payloads should be in a separate file
// Example payload for creating an applet via the API with 5 item types
    async createAppletPayload() {
    return {
        "displayName": `test ${Date.now()} `, "description": { "en": "" }, "themeId": "61323d4b-f710-2f0a-6e9b-358900000000", "about": { "en": "" }, "image": "", "watermark": "", "activities": [{ "name": `Test that the item types work as expected ${Date.now()}`, "description": { "en": "" }, "showAllAtOnce": false, "isSkippable": false, "responseIsEditable": true, "isHidden": false, "autoAssign": true, "isReviewable": false, "items": [{ "responseType": "singleSelect", "name": "ItemSS", "question": { "en": "Single Selection" }, "config": { "removeBackButton": false, "skippableItem": false, "randomizeOptions": false, "addScores": false, "setAlerts": false, "addTooltip": false, "setPalette": false, "timer": 0, "additionalResponseOption": { "textInputOption": false, "textInputRequired": false }, "portraitLayout": false, "autoAdvance": false, "responseDataIdentifier": false }, "isHidden": false, "allowEdit": true, "responseValues": { "options": [{ "id": "ff0095c8-646e-4d6b-9e63-b2c19edd2ace", "text": "Option 1", "isHidden": false, "value": 0 }, { "id": "5afc07a1-e94d-4791-ae62-3259a864eb22", "text": "Option 2", "isHidden": false, "value": 1 }] } }, { "responseType": "multiSelect", "name": "ItemMS", "question": { "en": "Multiple Selection" }, "config": { "removeBackButton": false, "skippableItem": false, "randomizeOptions": false, "addScores": false, "setAlerts": false, "addTooltip": false, "setPalette": false, "timer": 0, "additionalResponseOption": { "textInputOption": false, "textInputRequired": false }, "portraitLayout": false }, "isHidden": false, "allowEdit": true, "responseValues": { "options": [{ "id": "e3a1bdb9-619b-4664-bfd5-c310a67acd98", "text": "Option 1", "isHidden": false, "value": 0 }, { "id": "873eaddc-6996-435a-93e4-e363796f0aae", "text": "Option 2", "isHidden": false, "value": 1 }, { "id": "e83d8ffb-1299-42ae-befc-bbc7e888e74c", "text": "Option 3", "isHidden": false, "value": 2 }, { "id": "8a6ebaf5-5907-4265-a1a3-13bb6ab75840", "text": "Option 4", "isHidden": false, "value": 3 }, { "id": "69303212-da2c-4a81-9443-3f6041f8a528", "text": "None", "isHidden": false, "value": 4, "isNoneAbove": true }] } }, { "responseType": "slider", "name": "ItemSlider", "question": { "en": "Slider" }, "config": { "removeBackButton": false, "skippableItem": false, "addScores": false, "setAlerts": false, "showTickMarks": false, "showTickLabels": false, "continuousSlider": false, "timer": 0, "additionalResponseOption": { "textInputOption": false, "textInputRequired": false } }, "isHidden": false, "allowEdit": true, "responseValues": { "minValue": 0, "maxValue": 12, "minLabel": "0", "maxLabel": "12" } }, { "responseType": "numberSelect", "name": "ItemNumber", "question": { "en": "Number" }, "config": { "removeBackButton": false, "skippableItem": false, "additionalResponseOption": { "textInputOption": false, "textInputRequired": false } }, "isHidden": false, "allowEdit": true, "responseValues": { "minValue": 0, "maxValue": 100 } }, { "responseType": "text", "name": "ItemST", "question": { "en": "Short Text" }, "config": { "removeBackButton": false, "skippableItem": false, "maxResponseLength": 72, "correctAnswerRequired": false, "correctAnswer": "", "numericalResponseRequired": false, "responseDataIdentifier": false, "responseRequired": false }, "isHidden": false, "allowEdit": true, "responseValues": null }], "scoresAndReports": { "generateReport": false, "reports": [], "showScoreSummary": false }, "key": "70e20781-2c05-4bbf-8174-a3d4e198d52e", "reportIncludedItemName": "" }], "activityFlows": [], "reportEmailBody": "Please see the report attached to this email.", "streamIpAddress": null, "streamPort": null, "encryption": { "publicKey": "[28,187,204,139,160,225,75,196,225,232,45,214,100,207,56,39,102,80,77,210,44,203,30,68,220,35,128,84,68,68,86,139,149,87,13,76,39,114,137,220,219,10,85,142,145,66,198,198,143,191,229,33,71,97,233,27,185,17,234,245,205,194,85,23,198,178,91,46,109,204,133,182,185,23,156,87,120,17,95,49,67,94,142,71,113,229,227,179,102,8,111,206,94,120,109,29,170,157,109,159,201,158,30,235,131,135,196,171,1,135,203,117,140,253,21,69,140,93,77,147,223,5,3,12,29,41,95,219]", "prime": "[148,187,155,90,57,66,144,3,154,113,206,8,135,246,49,190,183,47,52,148,8,73,234,204,210,211,80,234,245,125,69,247,156,15,20,218,136,226,167,14,47,135,101,213,192,25,237,113,187,103,7,28,249,119,213,91,251,132,152,74,168,226,116,182,197,242,230,164,138,2,10,165,175,236,34,124,33,126,240,207,161,211,50,136,184,165,168,33,187,35,184,198,52,251,14,217,188,249,68,18,96,37,102,82,219,233,0,147,37,202,223,200,15,209,242,17,196,110,125,146,117,131,247,37,73,232,101,115]", "base": "[2]", "accountId": "d37f79fd-87f1-4e07-b0c3-7828495c3734" }
};

    // Important: make sure we authenticate in a clean environment by unsetting storage state.

    //Add more API request methods as needed
}

/**
* todo: add error handling, logging, and response parsing
* todo: add types for url and data
* todo: add return type
* todo: add JSDoc comments
* todo: decide if this should be in a class as an extension of a general method
**/

// Example payload for creating an applet via the API with 5 item types

}
