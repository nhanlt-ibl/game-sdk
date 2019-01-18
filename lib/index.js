"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const login_1 = require("./login");
login_1.initAuthenScript();
window.GameSDK = { TYPES: config_1.TYPES, loginCallback: login_1.loginCallback };
//# sourceMappingURL=index.js.map