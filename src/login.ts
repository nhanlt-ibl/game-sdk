import {AuthenURL, ButtonId} from './config';
import {TYPES} from '../lib/config';

export const loginCallback = (callback: (success: any, error: any) => void) => {
  window.addEventListener('message', (e: MessageEvent) => {
    try {
      if (e.data) {
        callback(e, null);
      } else {
        callback(null, 'message error');
      }
    } catch (e) {
      console.error(e);
      /* handle error */
    }
  });
};
const checkAuthen = () => {
  try {
    const urlParams: URLSearchParams = new URLSearchParams(
      window.location.search,
    );
    const params: string | null = urlParams.get('token');
    if (params && params.length > 0) {
      window.postMessage(
        JSON.stringify({
          type: TYPES.IS_AUTHENTICATED,
        }),
        '*',
      );
    } else {
      window.postMessage(
        JSON.stringify({
          type: TYPES.REQUEST_LOGIN,
        }),
        '*',
      );
    }
  } catch (e) {
    /* handle error */
  }
};
export const initAuthenScript = () => {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const loginBtn: HTMLElement | null = document.getElementById(ButtonId);
      if (!loginBtn) {
        throw `Quanta login button notfound \n Please add id=${ButtonId} into login tag`;
      }
      loginBtn.addEventListener('click', () => {
        if (
          loginBtn.dataset.loginType &&
          loginBtn.dataset.loginType === 'dialog'
        ) {
          const width = 780;
          const height = 700;
          const left = screen.width / 2 - width / 2;
          const top = screen.height / 2 - height / 2;
          const features = `width=${width}, height=${height}, top=${top}, left=${left}`;
          window.open(
            `${'./dialog.html'}?client_id=${loginBtn.dataset.clientId}`,
            'Login to Quanta Game Platform ',
            features,
          );
        } else {
          if (!loginBtn.dataset.redirect) {
            throw `if data-login-type='dialog' is not set, data-redirect must be provied`;
          }
          window.location.href = `${AuthenURL}?callback=${
            loginBtn.dataset.redirect
          }`;
        }
      });
    } catch (e) {
      console.error(e);
      /* handle error */
    }
  });
};
