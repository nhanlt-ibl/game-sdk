"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
exports.loginCallback = (callback) => {
    window.addEventListener('message', (e) => {
        try {
            if (e.data) {
                callback(JSON.parse(e.data || {}), null);
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
exports.initAuthenScript = () => {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const loginBtn = document.getElementById(config_1.ButtonId);
            if (!loginBtn) {
                throw `Quanta login button notfound \n Please add id=${config_1.ButtonId} into login tag`;
            }
            if (loginBtn.dataset.loginType === 'dialog') {
                const width = 780;
                const height = 700;
                const left = screen.width / 2 - width / 2;
                const top = screen.height / 2 - height / 2;
                const features = `width=${width}, height=${height}, top=${top}, left=${left}`;
                loginBtn.addEventListener('click', () => {
                    window.open(`${config_1.AuthenURL}?client_id=${loginBtn.dataset.clientId}`, 'Login to Quanta Game Platform ', features);
                });
                window.addEventListener('message', (e) => {
                    console.log('Receiver event: ', e.data);
                    document.location.href = `${loginBtn.dataset.redirect}?code=123123123`;
                });
            }
            else {
            }
        }
        catch (e) {
            console.error(e);
        }
    });
};
//# sourceMappingURL=login.js.map