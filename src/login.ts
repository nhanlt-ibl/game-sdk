import {AuthenURL, ButtonId, TYPES} from './config';

export const loginCallback = (callback: (success: any, error: any) => void) => {
  window.addEventListener('message', (e: MessageEvent) => {
    try {
      if (e.data) {
        callback(e, null);
      } else {
        callback(null, 'message error');
      }
    } catch (e) {
      callback(null, 'message error');
      console.error(e);
      /* handle error */
    }
  });
};
export const checkAuthen = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const urlParams: URLSearchParams = new URLSearchParams(
      window.location.search,
    );
    const token: string | null = urlParams.get('token') || '';
    const client_id: string | null = urlParams.get('client_id') || '';
    let message: any = {};
    if (token.length > 0 && client_id.length > 0) {
      return fetch(`${AuthenURL}?access_token=${token}&client_id=${client_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            return resolve(data);
          }
          return reject(data);
        })
        .catch(e => {
          return reject(e);
        });
    }
    return reject({
      status: 'error',
      message: 'invalid access_token or client_id',
    });
  });
};
export const requestLogin = () => {
  let message = {
    type: TYPES.REQUEST_LOGIN,
  };
  window.postMessage(JSON.stringify(message), '*');
};
export const sendMessage = (message: string) => {
  window.postMessage(message, '*');
};

export const loginSDK = () => {
  const loginBtn: HTMLElement | null = document.getElementById(ButtonId);
  if (!loginBtn) {
    throw `Quanta login button notfound \n Please add id=${ButtonId} into login tag`;
  }
  loginBtn.addEventListener('click', () => {
    if (loginBtn.dataset.loginType && loginBtn.dataset.loginType === 'dialog') {
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
};
