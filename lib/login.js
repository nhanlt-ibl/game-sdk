"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
exports.loginCallback = (callback) => {
    window.addEventListener('message', (e) => {
        try {
            if (e.data) {
                callback(e, null);
            }
            else {
                callback(null, 'message error');
            }
        }
        catch (e) {
            console.error(e);
        }
    });
};
exports.checkAuthen = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    let message = {};
    if (token && token.length > 0) {
        return true;
    }
    return false;
};
exports.requestLogin = () => {
    let message = {
        type: config_1.TYPES.REQUEST_LOGIN,
    };
    window.postMessage(JSON.stringify(message), '*');
};
exports.sendMessage = (message) => {
    window.postMessage(message, '*');
};
exports.loginSDK = () => {
    const loginBtn = document.getElementById(config_1.ButtonId);
    if (!loginBtn) {
        throw `Quanta login button notfound \n Please add id=${config_1.ButtonId} into login tag`;
    }
    loginBtn.addEventListener('click', () => {
        if (loginBtn.dataset.loginType && loginBtn.dataset.loginType === 'dialog') {
            const width = 780;
            const height = 700;
            const left = screen.width / 2 - width / 2;
            const top = screen.height / 2 - height / 2;
            const features = `width=${width}, height=${height}, top=${top}, left=${left}`;
            window.open(`${'./dialog.html'}?client_id=${loginBtn.dataset.clientId}`, 'Login to Quanta Game Platform ', features);
        }
        else {
            if (!loginBtn.dataset.redirect) {
                throw `if data-login-type='dialog' is not set, data-redirect must be provied`;
            }
            window.location.href = `${config_1.AuthenURL}?callback=${loginBtn.dataset.redirect}`;
        }
    });
};
//# sourceMappingURL=login.js.map