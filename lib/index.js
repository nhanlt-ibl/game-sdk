"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const login_1 = require("./login");
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('init script');
        login_1.loginSDK();
    }
    catch (e) {
        console.error(e);
    }
});
window.GameSDK = { TYPES: config_1.TYPES, requestLogin: login_1.requestLogin, sendMessage: login_1.sendMessage, loginCallback: login_1.loginCallback, checkAuthen: login_1.checkAuthen };
//# sourceMappingURL=index.js.map